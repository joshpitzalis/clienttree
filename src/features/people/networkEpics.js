import { tap, mapTo, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import {
  getActivitiesLeft,
  handleCompleteTask,
  setFirebaseContactUpdate,
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
    tap(async ({ payload }) => {
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

export const setNewUserTask = action$ =>
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

// 'people/updateForm'
