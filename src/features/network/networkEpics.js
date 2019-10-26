import { tap, mapTo, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import {
  getActivitiesLeft,
  handleCompleteTask,
  setFirebaseContactUpdate,
  inCompleteTask,
} from './networkAPI';
import { toast$ } from '../notifications/toast';
import { ACTIVITY_COMPLETED, USER_UPDATED } from './networkConstants';

export const markActivityComplete = action$ =>
  action$.pipe(
    ofType(ACTIVITY_COMPLETED),
    tap(async ({ payload }) => {
      const {
        taskId,
        myUid,
        completedFor,
        setSelectedUser,
        setVisibility,
        checked,
      } = payload;

      console.log({ checked });

      if (checked) {
        // if task is complete mark incomplete
        await inCompleteTask(taskId, myUid, completedFor);
      } else {
        // mark task complete in db
        await handleCompleteTask(taskId, myUid, completedFor);

        // track event in amplitude
        const { analytics } = window;
        analytics.track('Helped Someone');
        // if no more task for this contact then open the contact modal so people can add a next task
        getActivitiesLeft(myUid, completedFor).then(
          async numberofActiveTasks => {
            if (numberofActiveTasks === 1) {
              setSelectedUser(completedFor);
              setVisibility(true);
            }
          }
        );
      }
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
