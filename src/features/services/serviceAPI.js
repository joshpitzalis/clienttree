import firebase from '../../utils/firebase';

export const handleFirebaseUpdate = payload => {
  const { id, field, value, userId } = payload;
  return firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .set(
      {
        services: {
          [id]: {
            [field]: value,
          },
        },
      },
      { merge: true }
    );
};

export const fetchUserData = uid => {
  console.log({ uid });
  return firebase
    .firestore()
    .collection('users')
    .doc(uid)
    .get()
    .then(doc => doc.data());
};
