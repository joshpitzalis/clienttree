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

export const setTitle = payload => {
  const { dashboard, userId } = payload;
  // throw new Error('xxx');
  return firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .set({ dashboard }, { merge: true });

  // return new Promise(resolve => setTimeout(resolve, 2000, payload));
};
