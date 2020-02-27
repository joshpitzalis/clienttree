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

export const saveImportedContacts = (importedContacts, userId) => {
  const set = (_contact, _userId) => {
    const newDoc = firebase
      .firestore()
      .collection('users')
      .doc(_userId)
      .collection('contacts')
      .doc();

    const oneYearAgo = new Date().setFullYear(new Date().getFullYear() - 1);
    const lastContacted = +new Date(oneYearAgo);

    return firebase
      .firestore()
      .collection('users')
      .doc(_userId)
      .collection('contacts')
      .doc(newDoc.id)
      .set(
        {
          uid: newDoc.id,
          lastContacted,
          notes: {},
          bucket: 'archived',
          ..._contact,
        },
        { merge: true }
      );
  };

  // pending();

  const writeOps = importedContacts.map(contact => set(contact, userId));

  return Promise.all(writeOps)
    .then(() => console.log({ success: importedContacts }))
    .catch(error => console.log({ error }));
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
  console.log({ payload });
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
