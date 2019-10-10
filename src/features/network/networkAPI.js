import { collection } from 'rxfire/firestore';
import { map, catchError } from 'rxjs/operators';
import firebase from '../../utils/firebase';
import { toast$ } from '../notifications/toast';

export const setFirebaseContactUpdate = async payload => {
  const {
    userId,
    contactId,
    name,
    summary,
    lastContacted,
    photoURL,
    imgString,
  } = payload;
  const newDoc = firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('contacts')
    .doc();

  const contactUid = contactId || newDoc.id;
  let downloadURL;

  if (imgString) {
    // upload the base 64 string to get an image url
    downloadURL = await firebase
      .storage()
      .ref()
      .child(`contacts/${contactUid}.png`)
      .putString(imgString, 'data_url', { contentType: 'image/png' })
      .then(({ ref }) => ref.getDownloadURL());
  }

  return firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('contacts')
    .doc(contactUid)
    .set(
      {
        name,
        summary,
        uid: contactUid,
        lastContacted,
        photoURL: photoURL || downloadURL,
      },
      { merge: true }
    );
};

// export const getFirebaseContacts = uid =>
//   collection(
//     firebase
//       .firestore()
//       .collection('users')
//       .doc(uid)
//       .collection('contacts')
//   )
//     .pipe(
//       map(docs => docs.map(d => d.data())),
//       catchError(error =>
//         toast$.next({
//           type: 'ERROR',
//           message: error.message || error,
//         })
//       )
//     )
//     .subscribe(network => setContacts(network));
