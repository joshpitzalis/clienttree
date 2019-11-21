import { tap, mapTo, catchError, debounceTime } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { toast$ } from '../notifications/toast';
import { FORM_SUBMITTED } from './statsConstants';
import firebase from '../../utils/firebase';

// input$
//   .pipe(
//     tap(e => {
//       if (e.name === name) {
//         setSaving('Saving...');
//         setSaved('');
//       }
//     }),
//     debounceTime(500),
//     switchMap(e => {
//       if (e.name === name && userId) {
//         from(
//           firebase
//             .firestore()
//             .collection('users')
//             .doc(userId)
//             .set({ stats: { [e.name]: e.value } }, { merge: true })
//         ).pipe(mapTo(e));
//       }
//     }),
//     tap(e => {
//       if (e.name && e.name === name) {
//         setSaved('Saved');
//         setSaving('');
//       }
//     })
//   )

//   .subscribe();

export const updateStatsDetails = action$ =>
  action$.pipe(
    ofType(FORM_SUBMITTED),
    debounceTime(500),
    tap(e => {
      const { userId, name, value } = e.payload;
      firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .set({ stats: { [name]: value } }, { merge: true });
    }),
    catchError(error =>
      toast$.next({ type: 'ERROR', message: error.message || error })
    ),
    mapTo({ type: 'hustle form updated' })
  );

// export const updateUserDetails = action$ =>
// action$.pipe(
//   ofType(FORM_SUBMITTED),
//   tap(async ({ payload }) => {
//     const { userId, goal, average, income, deadline } = payload;

//     // update user details
//     await firebase
//       .firestore()
//       .collection('users')
//       .doc(userId)
//       .set(
//         { goal, average, income, deadline: +new Date(deadline) },
//         { merge: true }
//       );

//     // track event in amplitude
//     const { analytics } = window;
//     analytics.track('Stats Updated');
//   }),
//   catchError(error =>
//     toast$.next({ type: 'ERROR', message: error.message || error })
//   ),
//   mapTo({ type: 'user details update complete' })
// );
