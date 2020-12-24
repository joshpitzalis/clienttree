import firebase from '../../utils/firebase'

export const brandyNewContacts = (_new, _existing) => _new.reduce((total, item) => {
  const nameMatch = _existing.some(element => element.name === item.name)
  const emailMatch = _existing.some(element => element.email === item.email)
  if ((!nameMatch && !emailMatch) || (!nameMatch && !item.email)) {
    total.push(item)
  }
  return total
}, [])

export const contactCleaner = connections => {
  const getData = (person, field, key) => {
    if (key) {
      return person &&
        person[field] &&
        person[field].length > 0 &&
        person[field][0]
        ? person[field][0][key]
        : null
    }
    return person &&
      person[field] &&
      person[field].length > 0 &&
      person[field][0]
      ? person[field][0]
      : null
  }
  return connections.map(person => ({
    resourceName: person.resourceName,
    name: getData(person, 'names', 'displayName'),
    photoURL: getData(person, 'photos', 'url'),
    defaultImage: !!getData(person, 'photos', 'default'),
    address: getData(person, 'addresses'),
    email: getData(person, 'emailAddresses', 'value'),
    gender: getData(person, 'genders', 'value'),
    metadata: getData(person, 'metadata', 'sources'),
    occupation: getData(person, 'occupations', 'value'),
    organization: getData(person, 'organizations'),
    residence: getData(person, 'residences', 'value'),
    phoneNumber: getData(person, 'phoneNumbers', 'value')
  }))
}
export const findConflict = (newContacts, old) => {
  // NAME_MATCHES      EMAIL_MATCHES    CONFLICT
  // true              true             false (identical)
  // true              false            true
  // false             true             true
  // false             false            false
  const findMatch = (_new, _old, matcher) => _old && _old.find(element => element[matcher] === _new[matcher])
  const duplicates = newContacts &&
    newContacts.filter(item => findMatch(item, old, 'name') !== findMatch(item, old, 'email'))
  return duplicates.filter(
    // only return duplicates that have an email and name field
    // so no blank fields on incoming conflicts
    _item =>
      // (_item.email !== '' || _item.email !== null) &&
      // (_item.name !== '' || _item.name !== null)
      _item.email && _item.name)
}
export const fetchContacts = ({ _gapi, existingContacts, userId, send, setContacts }) => {
  const personFields = 'addresses,emailAddresses,genders,metadata,names,occupations,organizations,phoneNumbers,photos,residences'
  const getAllContacts = async (_people, _token, _gapi) => {
    const getContacts = (_gapi, _nextPageToken) => _gapi.client.people.people.connections
      .list({
        resourceName: 'people/me',
        pageSize: 2000,
        personFields,
        pageToken: _nextPageToken
      })
      .then(response => {
        const { connections, nextPageToken } = response.result
        return { people: connections, nextPageToken }
      })
    if (_people.length < 2000) {
      // terminal case
      const result = await getContacts(_gapi, _token)
      return _people.push(...result.people)
    }
    // block to execute
    const { people, nextPageToken } = await getContacts(_gapi, _token)
    _people.push(...people)
    getAllContacts(people, nextPageToken, _gapi)
  }
  return _gapi.client.people.people.connections
    .list({
      resourceName: 'people/me',
      pageSize: 2000,
      personFields
    })
    .then(async (response) => {
      const { connections, nextPageToken } = response.result
      const contacts = [...connections]
      if (contacts.length >= 2000) {
        await getAllContacts(contacts, nextPageToken, _gapi)
      }
      return contacts
    })
    .then(connections => contactCleaner(connections))
    .then(newContacts => {
      const conflicts = findConflict(newContacts, existingContacts)
      const brandNew = brandyNewContacts(newContacts, existingContacts)
      if (conflicts.length) {
        send('CONFLICTS_FOUND')
      } else {
        send('NO_CONFLICTS_FOUND')
      }
      return brandNew
    })
    .then(contacts => setContacts(contacts))
    .catch(console.error)
}
export const saveImportedContacts = (importedContacts, userId) => {
  const chunkArrayInGroups = (arr, size) => {
    const newArr = []
    for (let i = 0; i < arr.length; i += size) {
      newArr.push(arr.slice(i, i + size))
    }
    return newArr
  }
  const writeEachSyncronously = async (chunks, createBatch) => {
    const payload = []
    // starts here =>
    for (let index = 0; index < chunks.length; index += 1) {
      // await asyncForEach(chunks[index], createBatch);
      const response = await createBatch(chunks[index])
      payload.push(response)
    }
    return payload
  }
  const set = async (_contact, _userId, _batch) => {
    const newDoc = firebase
      .firestore()
      .collection('users')
      .doc(_userId)
      .collection('contacts')
      .doc()
    const oneYearAgo = new Date().setFullYear(new Date().getFullYear() - 1)
    const lastContacted = +new Date(oneYearAgo)
    const ref = firebase
      .firestore()
      .collection('users')
      .doc(_userId)
      .collection('contacts')
      .doc(newDoc.id)
    _batch.set(ref, {
      uid: newDoc.id,
      lastContacted,
      bucket: 'archived',
      ..._contact
    })
  }
  const createBatch = chunk => {
    const _batch = firebase.firestore().batch()
    const operations = chunk.map(contact => set(contact, userId, _batch))
    Promise.all(operations)
      .then(() => _batch.commit())
      .then(() => 'success')
      .catch(console.error)
  }
  if (importedContacts && importedContacts.length > 500) {
    const contactChunks = chunkArrayInGroups(importedContacts, 500)
    return writeEachSyncronously(contactChunks, createBatch)
  }
  const batch = firebase.firestore().batch()
  importedContacts.forEach(contact => set(contact, userId, batch))
  return batch
    .commit()
    .then(() => console.log({ success: importedContacts }))
    .catch(error => console.log({ error }))
}
