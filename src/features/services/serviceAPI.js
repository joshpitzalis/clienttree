import firebase from '../../utils/firebase';

export const handleFirebaseUpdate = payload =>
  firebase
    .firestore()
    .collection('services')
    .doc(payload.id)
    .set(
      {
        name: payload.name,
      },
      { merge: true }
    );
