import firebase from '../../utils/firebase';

export const handleFirebaseDelete = ({ id, userId }) =>
  firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .set(
      {
        services: {
          [id]: firebase.firestore.FieldValue.delete(),
        },
      },
      { merge: true }
    );

export const handleFirebaseProfileUpdate = payload => {
  const { userId, name, designation, website, clients, service } = payload;

  return firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .set(
      { name, designation, website, clients, service, userId },
      { merge: true }
    );
};

export const handleFirebaseUpdate = payload => {
  const { id, userId, name, description, price, link } = payload;
  return firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .set(
      {
        services: {
          [id]: {
            id,
            name,
            description,
            price,
            link,
          },
        },
      },
      { merge: true }
    );
};

export const fetchUserData = uid =>
  firebase
    .firestore()
    .collection('users')
    .doc(uid)
    .get()
    .then(doc => doc.data());
