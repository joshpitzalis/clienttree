import firebase from '../../utils/firebase';

export const setStateToDB = (userId, state) => {
  console.log({ userId });
  return firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .set(
      {
        dashboard: state,
      },
      { merge: true }
    );
};
