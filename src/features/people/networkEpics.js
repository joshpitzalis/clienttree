import {
  tap,
  mapTo,
  switchMap,
  debounceTime,
  map,
  catchError,
  ignoreElements,
} from 'rxjs/operators';
import { of, from } from 'rxjs';
import { ofType } from 'redux-observable';
import {
  getActivitiesLeft,
  handleCompleteTask,
  inCompleteTask,
} from './peopleAPI';
import { toast$ } from '../notifications/toast';
import { ACTIVITY_COMPLETED, USER_UPDATED } from './networkConstants';
import { handleActivityCompleted } from '../stats/statsHelpers';

export const markActivityComplete = (
  action$,
  state$,
  { decrementActivityStats, incrementActivityStats, track }
) =>
  action$.pipe(
    ofType(ACTIVITY_COMPLETED),
    tap(({ payload }) => {
      handleActivityCompleted(
        payload,
        inCompleteTask,
        decrementActivityStats,
        handleCompleteTask,
        incrementActivityStats,
        track,
        getActivitiesLeft
      );
    }),
    catchError(error =>
      toast$.next({ type: 'ERROR', message: error.message || error })
    ),
    mapTo({ type: 'done' })
  );

export const setNewUserTask = (action$, store, { setFirebaseContactUpdate }) =>
  action$.pipe(
    ofType(USER_UPDATED),
    tap(async ({ payload }) => {
      setFirebaseContactUpdate(payload);
    }),
    catchError(error =>
      toast$.next({ type: 'ERROR', message: error.message || error })
    ),
    mapTo({ type: 'done' })
  );

export const updateContactEpic = (action$, state$, { setContact }) => {
  const emptyGuard = (action, defaultTitle) => {
    if (action.payload.name.trim() === '') {
      const newAction = { ...action };
      newAction.payload.name = defaultTitle;
      return newAction;
    }
    return action;
  };

  return action$.pipe(
    ofType('people/updateForm'),
    debounceTime(1000),
    map(action => emptyGuard(action, 'Name cannot be blank')),
    switchMap(({ payload }) => {
      // get your user Id from the store
      const { userId } = state$.value.user;
      // update contact on firebase
      return from(setContact(userId, payload)).pipe(
        // success message
        map(() => ({ type: 'people/formSaved' })),
        // error handling
        catchError(error =>
          of({
            error: true,
            type: 'people/formError',
            payload: error,
            meta: { source: 'updateContactEpic' },
          })
        )
      );
    })
  );
};
