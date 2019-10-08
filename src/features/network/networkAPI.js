import { collection } from 'rxfire/firestore';
import { map, catchError } from 'rxjs/operators';
import firebase from '../../utils/firebase';
import { toast$ } from '../notifications/toast';

export const setFirebaseContactUpdate = payload => {
  const { userId, contactId, name, summary } = payload;
  const newDoc = firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('contacts')
    .doc();

  const contactUid = contactId || newDoc.id;

  return firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('contacts')
    .doc(contactUid)
    .set({ name, summary, uid: contactUid }, { merge: true });
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
