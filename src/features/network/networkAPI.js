import firebase from '../../utils/firebase';

export const setFirebaseContactUpdate = payload => {
  const { userId, contactId, name, summary } = payload;
  const newDoc = firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('contacts')
    .doc();
  console.log({ newDoc });

  const contactUid = contactId || newDoc.id;

  return firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('contacts')
    .doc(contactUid)
    .set({ name, summary, uid: contactUid }, { merge: true });
};

export const getFirebaseContacts = uid =>
  firebase
    .firestore()
    .collection('users')
    .doc(uid)
    .collection('contacts')
    .get()
    .then(collection => collection.docs.map(doc => doc.data()));
