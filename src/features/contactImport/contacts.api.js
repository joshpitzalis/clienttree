import firebase from '../../utils/firebase';
import {
  brandyNewContacts,
  contactCleaner,
  findConflict,
} from './contacts.helpers';

export const setNewContact = (userId, contact) => {
  const { name, email, photoURL } = contact;

  const newContactRef = firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('contacts')
    .doc();

  const oneYearAgo = new Date().setFullYear(new Date().getFullYear() - 1);

  return newContactRef.set(
    {
      name,
      email,
      uid: newContactRef.id,
      lastContacted: +new Date(oneYearAgo),
      photoURL: photoURL || `https://ui-avatars.com/api/?name=${name}`,
    },
    { merge: true }
  );
};

export const updateContact = (userId, contact) => {
  const { name, email, photoURL } = contact;

  return firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('contacts')
    .doc(contact.uid)
    .set(
      {
        name,
        email,
        photoURL: photoURL || `https://ui-avatars.com/api/?name=${name}`,
      },
      { merge: true }
    );
};

export const writeEachSyncronously = async (chunks, createBatch) => {
  const payload = [];

  // async function asyncForEach(chunk, callback) {
  //   for (let index = 0; index < chunk.length; index += 1) {
  //     console.log({ chunk });
  //     const response = await callback(chunk);
  //     payload.push(response);
  //   }
  // }

  // starts here =>
  for (let index = 0; index < chunks.length; index += 1) {
    // await asyncForEach(chunks[index], createBatch);
    const response = await createBatch(chunks[index]);
    payload.push(response);
  }

  return payload;
};

export const chunkArrayInGroups = (arr, size) => {
  const newArr = [];

  for (let i = 0; i < arr.length; i += size) {
    newArr.push(arr.slice(i, i + size));
  }
  return newArr;
};

export const saveImportedContacts = (importedContacts, userId) => {
  const set = async (_contact, _userId, _batch) => {
    const newDoc = firebase
      .firestore()
      .collection('users')
      .doc(_userId)
      .collection('contacts')
      .doc();

    const oneYearAgo = new Date().setFullYear(new Date().getFullYear() - 1);
    const lastContacted = +new Date(oneYearAgo);

    const ref = firebase
      .firestore()
      .collection('users')
      .doc(_userId)
      .collection('contacts')
      .doc(newDoc.id);

    _batch.set(ref, {
      uid: newDoc.id,
      lastContacted,
      bucket: 'archived',
      ..._contact,
    });
  };

  const createBatch = chunk => {
    const _batch = firebase.firestore().batch();
    const operations = chunk.map(contact => set(contact, userId, _batch));
    Promise.all(operations)
      .then(() => _batch.commit())
      .then(() => 'success')
      .catch(console.error);
  };

  // pending();

  // const writeOps = importedContacts.map(contact => set(contact, userId, batch));
  if (importedContacts && importedContacts.length > 500) {
    const contactChunks = chunkArrayInGroups(importedContacts, 500);
    return writeEachSyncronously(contactChunks, createBatch);
  }

  const batch = firebase.firestore().batch();
  importedContacts.forEach(contact => set(contact, userId, batch));
  return batch
    .commit()
    .then(() => console.log({ success: importedContacts }))
    .catch(error => console.log({ error }));

  // Promise.all(writeOps)
};

export const _activateContact = (ctx, { payload }) => {
  const { userId, uid } = payload;
  return firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('contacts')
    .doc(uid)
    .set(
      {
        bucket: 'active',
      },
      { merge: true }
    );
};
export const _archiveContact = (ctx, { payload }) => {
  const { userId, uid } = payload;

  return firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('contacts')
    .doc(uid)
    .set(
      {
        bucket: 'archived',
      },
      { merge: true }
    );
};
export const _trashContact = (ctx, { payload }) => {
  const { userId, uid } = payload;
  return firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('contacts')
    .doc(uid)
    .delete();
};

export const markImported = userId =>
  firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .set(
      {
        contactsImported: true,
      },
      { merge: true }
    );

export const updateContactCount = (userId, contactStats) => {
  const { activeContacts, archivedContacts, totalContacts } = contactStats;
  return firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .set(
      {
        activeContacts,
        archivedContacts,
        totalContacts,
      },
      { merge: true }
    );
};

// ###

const personFields =
  'addresses,emailAddresses,genders,metadata,names,occupations,organizations,phoneNumbers,photos,residences';

const getContacts = (_gapi, _nextPageToken) =>
  _gapi.client.people.people.connections
    .list({
      resourceName: 'people/me',
      pageSize: 2000,
      personFields,
      pageToken: _nextPageToken,
    })
    .then(response => {
      const { connections, nextPageToken } = response.result;
      return { people: connections, nextPageToken };
    });

const getAllContacts = async (_people, _token, _gapi) => {
  if (_people.length < 2000) {
    // terminal case
    const result = await getContacts(_gapi, _token);
    return _people.push(...result.people);
  }

  // block to execute
  const { people, nextPageToken } = await getContacts(_gapi, _token);
  _people.push(...people);
  getAllContacts(people, nextPageToken, _gapi);
};

export const fetchContacts = ({ _gapi, existingContacts, userId, send }) =>
  _gapi.client.people.people.connections
    .list({
      resourceName: 'people/me',
      pageSize: 2000,
      personFields,
    })
    .then(async response => {
      const { connections, nextPageToken } = response.result;
      const contacts = [...connections];

      if (contacts.length >= 2000) {
        await getAllContacts(contacts, nextPageToken, _gapi);
      }

      return contacts;
    })
    .then(connections => contactCleaner(connections))
    .then(newContacts => {
      const conflicts = findConflict(newContacts, existingContacts);
      const brandNew = brandyNewContacts(newContacts, existingContacts);

      if (conflicts.length) {
        send('CONFLICTS_FOUND');
      } else {
        send('NO_CONFLICTS_FOUND');
      }

      return brandNew;
    })
    .then(contacts => saveImportedContacts(contacts, userId))
    .then(() => markImported(userId))
    .catch(console.error);

export const mergeAllConflicts = ({ conflicts, uid, _updateContact }) => {
  const operations = conflicts.map(confict => _updateContact(uid, confict));
  Promise.all(operations).catch(console.error);
};

export const handleContactsUpdate = ({
  contactsToAdd,
  contactsToDelete,
  contactsToArchive,
  uid,
  activeContacts,
  archivedContacts,
  totalContacts,
}) => {
  const docRef = (userId, collection, contactUid) =>
    firebase
      .firestore()
      .collection('users')
      .doc(userId)
      .collection(collection)
      .doc(contactUid);
  // set(), update(), or delete()

  const batch = firebase.firestore().batch();

  contactsToAdd.forEach(contact => {
    if (!contact.bucket) {
      // write new
      batch.set(docRef(uid, 'people', contact.uid), {
        ...contact,
        bucket: 'active',
      });
      // delete old
      batch.delete(docRef(uid, 'contacts', contact.uid));
      return;
    }
    batch.update(docRef(uid, 'people', contact.uid), { bucket: 'active' });
  });

  contactsToArchive.forEach(contact =>
    batch.update(docRef(uid, 'people', contact.uid), { bucket: 'archived' })
  );

  contactsToDelete.forEach(contact =>
    batch.delete(docRef(uid, 'people', contact.uid))
  );

  return batch
    .commit()
    .then(() =>
      updateContactCount(uid, {
        activeContacts: activeContacts + contactsToAdd - contactsToArchive,
        archivedContacts: archivedContacts + contactsToArchive - contactsToAdd,
        totalContacts: totalContacts - contactsToDelete.length,
      })
    )
    .then(() => console.log('success'))
    .catch(error => console.log({ error }));
};
