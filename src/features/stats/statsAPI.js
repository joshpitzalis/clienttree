import firebase from '../../utils/firebase';
import { toast$ } from '../notifications/toast';

export const incrementActivityStats = _uid => console.log({ _uid });

export const decrementActivityStats = async _uid =>
  firebase
    .firestore()
    .collectionGroup('helpfulTasks')
    .where('connectedTo', '==', _uid)
    .where('dateCompleted', '>', new Date(0))
    .get()
    .then(collection => {
      const data = collection.docs.map(doc => doc.data());
      return data.length;
    })
    .then(activityCount => {
      const newActivityCount = activityCount - 1;
      return firebase
        .firestore()
        .collection('users')
        .doc(_uid)
        .set(
          {
            stats: {
              activitiesCompleted: newActivityCount,
            },
          },
          { merge: true }
        );
    })
    .catch(error =>
      toast$.next({
        type: 'ERROR',
        message: error && error.message ? error.message : error,
      })
    );
