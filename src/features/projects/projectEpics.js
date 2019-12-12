import {
  switchMap,
  debounceTime,
  mapTo,
  catchError,
  tap,
} from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { from } from 'rxjs';
import {
  getDashboardWithNewTitle,
  getCurrentUser,
  getDashboardWithNewStage,
  getDashboardWithoutStage,
} from './dashHelpers';

export const stageTitleUpdate = (action$, store, { updateUserProfile }) =>
  action$.pipe(
    ofType('projects/updateTitle'),
    debounceTime(1000),
    switchMap(({ payload }) =>
      from(
        updateUserProfile({
          dashboard: getDashboardWithNewTitle(store, payload),
          userId: getCurrentUser(store),
        })
      ).pipe(
        mapTo({ type: 'projects/titleSaved' }),
        catchError(error => ({
          error: true,
          type: 'projects/titleError',
          payload: error,
          meta: { source: 'stageTitleUpdate' },
        }))
      )
    )
  );

export const newStageCreated = (action$, store, { updateUserProfile }) =>
  action$.pipe(
    ofType('projects/createNewStage'),
    debounceTime(1000),
    switchMap(({ payload }) =>
      from(
        updateUserProfile({
          dashboard: getDashboardWithNewStage(store, payload),
          userId: getCurrentUser(store),
        })
      ).pipe(
        mapTo({ type: 'projects/stageCreated' }),
        catchError(error => ({
          error: true,
          type: 'projects/stageCreationError',
          payload: error,
          meta: { source: 'newStageCreated' },
        }))
      )
    )
  );

export const stageDestroyed = (action$, store, { updateUserProfile }) =>
  action$.pipe(
    ofType('projects/destroyStage'),
    switchMap(({ payload }) =>
      from(
        updateUserProfile({
          dashboard: getDashboardWithoutStage(store, payload),
          userId: getCurrentUser(store),
        })
      ).pipe(
        mapTo({ type: 'projects/stageDestroyed' }),
        catchError(error => ({
          error: true,
          type: 'projects/stageDestructionError',
          payload: error,
          meta: { source: 'stageDestroyed' },
        }))
      )
    )
  );
