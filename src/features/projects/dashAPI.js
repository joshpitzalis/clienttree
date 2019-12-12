import firebase from '../../utils/firebase';

export const setStateToDB = (userId, state) =>
  firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .set(
      {
        dashboard: state,
      },
      { merge: true }
    );

export const setChallenge = ({ title, link, id, userId, stageId }) =>
  firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .set(
      {
        dashboard: {
          stages: {
            [stageId]: {
              challenges: firebase.firestore.FieldValue.arrayUnion({
                title,
                link,
                id,
              }),
            },
          },
        },
      },
      { merge: true }
    );

export const removeChallenge = ({ title, link, id, userId, stageId }) =>
  firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .set(
      {
        dashboard: {
          stages: {
            [stageId]: {
              challenges: firebase.firestore.FieldValue.arrayRemove({
                title,
                link,
                id,
              }),
            },
          },
        },
      },
      { merge: true }
    );

export const updateUserProfile = payload => {
  const { dashboard, userId } = payload;
  return firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .set({ dashboard }, { merge: true });
};
