import { collection } from 'rxfire/firestore';
import firebase from '../../utils/firebase';

export const unfinishedTasks$ = uid =>
  collection(
    firebase
      .firestore()
      .collectionGroup('helpfulTasks')
      .where('connectedTo', '==', uid)
      .where('dateCompleted', '>', new Date(0))
  );

export const contacts$ = uid =>
  collection(
    firebase
      .firestore()
      .collection('users')
      .doc(uid)
      .collection('contacts')
  );
