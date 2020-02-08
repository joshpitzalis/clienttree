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

  const newContactRef = firebase
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
