import { tap, mapTo, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { toast$ } from '../notifications/toast';
import { FORM_SUBMITTED } from './statsConstants';
import firebase from '../../utils/firebase';

// export const logEpic = action$ =>
//   action$.pipe(
//     ofType('logMe'),
//     tap(({ payload }) => console.log('frog', payload)),
//     mapTo({ type: 'PONG' })
//   );

export const updateUserDetails = action$ =>
  action$.pipe(
    ofType(FORM_SUBMITTED),
    tap(async ({ payload }) => {
      const { userId, goal, average, income, deadline } = payload;

      // update user details
      await firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .set(
          { goal, average, income, deadline: +new Date(deadline) },
          { merge: true }
        );

      // track event in amplitude
      const { analytics } = window;
      analytics.track('Stats Updated');
    }),
    catchError(error =>
      toast$.next({ type: 'ERROR', message: error.message || error })
    ),
    mapTo({ type: 'user details update complete' })
  );
