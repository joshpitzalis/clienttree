import firebase from '../../utils/firebase';

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
    console.log('chunk', chunk);
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
    console.log('importedContacts', importedContacts.length);
    const contactChunks = chunkArrayInGroups(importedContacts, 500);
    console.log('contactChunks', contactChunks);
    return writeEachSyncronously(contactChunks, createBatch);
  }
  console.log('nono');
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
