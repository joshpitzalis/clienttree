import firebase from '../../utils/firebase';

export const setNewContact = (userId, contact) => {
  const { name, email } = contact;

  const newContactRef = firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('contacts')
    .doc();

  newContactRef.set(
    {
      name,
      email,
      id: newContactRef.id,
    },
    { merge: true }
  );
};
