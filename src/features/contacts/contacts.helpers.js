import { toast$ } from '../notifications/toast'

export const parseContacts = _contacts =>
  _contacts.map(contact => {
    const first = contact.first_name && contact.first_name.toLowerCase()
    const last = contact.last_name && contact.last_name.toLowerCase()
    const name = `${first} ${last}`
    const email =
      contact.__selectedMail__ && contact.__selectedMail__.toLowerCase()
    const photoURL =
      contact.photos && contact.photos[0] && contact.photos[0].value

    return {
      name: (name && name.trim()) || (email && email.trim()),
      email: email && email.trim(),
      photoURL
    }
  })

export const findConflicts = (newContacts, old) => {
  // NAME_MATCHES      EMAIL_MATCHES    CONFLICT
  // true              true             false (identical)
  // true              false            true
  // false             true             true
  // false             false            false

  const findMatch = (_new, _old, matcher) =>
    _old.find(element => element[matcher] === _new[matcher])

  const duplicates = newContacts.filter(
    item => findMatch(item, old, 'name') !== findMatch(item, old, 'email')
  )

  // only return duplicates that have an email and name field
  // so no blank fields on incoming conflicts
  return duplicates.filter(_item => _item.email !== '' && _item.name !== '')
}

export const findBrandNewContacts = (newContacts, existing) =>
  newContacts.reduce((total, item) => {
    const nameMatch = existing.some(element => element.name === item.name)

    const emailMatch = existing.some(element => element.email === item.email)

    if (!nameMatch && !emailMatch) {
      total.push(item)
    }

    return total
  }, [])

export const handleContactSync = ({
  userId,
  existingContacts,
  newContacts,
  setDuplicates,
  add,
  set,
  error,
  success,
  pending
}) => {
  const duplicates = findConflicts(newContacts, existingContacts)

  const brandNewContacts = findBrandNewContacts(newContacts, existingContacts)

  if (duplicates.length) {
    setDuplicates(duplicates)
  }

  add({
    userId,
    newContacts: brandNewContacts,
    set,
    error,
    success,
    pending
  })
}

// ###

export const handleError = (error, from) =>
  toast$.next({
    type: 'ERROR',
    message: error && error.message ? error.message : error,
    from
  })

export const handleSuccessfulCompletion = () =>
  toast$.next({
    type: 'SUCCESS',
    message: 'Contacts Imported Successfully'
  })

export const handlePending = () =>
  toast$.next({
    message: 'Contacts Importing...'
  })

export const handleAddition = ({
  userId,
  newContacts,
  set,
  error,
  success,
  pending
}) => {
  pending()
  const writeOps = newContacts.map(contact => set(userId, contact))

  return Promise.all(writeOps)
    .then(success)
    .catch(_error => error(_error, 'contacts/handleAddition'))
}
