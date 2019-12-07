import {
  tap,
  map,
  mapTo,
  catchError,
  debounceTime,
  switchMap,
} from 'rxjs/operators';
import { collection } from 'rxfire/firestore';
import { ofType } from 'redux-observable';
import { toast$ } from '../notifications/toast';
import { FORM_SUBMITTED } from './statsConstants';
import firebase from '../../utils/firebase';

export const leadContacted = (action$, state$) => {
  const calculateLeadRatio = (_leadsContacted, _activitiesCompleted) =>
    Math.ceil(_activitiesCompleted / _leadsContacted + 1);

  return action$.pipe(
    ofType('crm/newleadContacted'),

    switchMap(() =>
      collection(
        firebase
          .firestore()
          .collectionGroup('helpfulTasks')
          .where('connectedTo', '==', state$.value.user.userId)
          .where('dateCompleted', '>', new Date(0))
      )
    ),
    map(docs => docs.map(d => d.data())),
    tap(tasks => {
      const { userId } = state$.value.user;
      const { leadsContacted = 1 } = state$.value.user.stats;
      const activitiesCompleted = tasks.length;
      return firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .set(
          {
            stats: {
              leadsContacted: leadsContacted + 1,
              leadRatio: calculateLeadRatio(
                leadsContacted,
                activitiesCompleted
              ),
            },
          },
          { merge: true }
        );
    }),
    catchError(error =>
      toast$.next({ type: 'ERROR', message: error.message || error })
    ),
    mapTo({ type: 'DONE' })
  );
};

export const projectCompleted = (action$, state$) => {
  const calculateProjectRatio = (_leadsContacted, _projectsCompleted) =>
    Math.ceil(_leadsContacted / _projectsCompleted + 1);

  return action$.pipe(
    ofType('crm/newProjectCompleted'),
    tap(() => {
      const { userId } = state$.value.user;
      const {
        projectsCompleted = 1,
        leadsContacted = 1,
      } = state$.value.user.stats;

      return firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .set(
          {
            stats: {
              projectsCompleted: projectsCompleted + 1,
              projectRatio: calculateProjectRatio(
                leadsContacted,
                projectsCompleted
              ),
            },
          },
          { merge: true }
        );
    }),
    catchError(error =>
      toast$.next({ type: 'ERROR', message: error.message || error })
    ),
    mapTo({ type: 'DONE' })
  );
};

export const updateStatsDetails = action$ =>
  action$.pipe(
    ofType(FORM_SUBMITTED),
    debounceTime(1000),
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
