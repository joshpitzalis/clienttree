import {
  switchMap,
  debounceTime,
  mapTo,
  map,
  catchError,
} from 'rxjs/operators';
import { of, from } from 'rxjs';
import { ofType } from 'redux-observable';
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
    map(action => {
      // guard against empty input values
      if (action.payload.title && action.payload.title.trim() === '') {
        const newAction = { ...action };
        newAction.payload.title = 'Title cannot be blank';
        return newAction;
      }
      return action;
    }),
    switchMap(({ payload }) =>
      from(
        updateUserProfile({
          dashboard: getDashboardWithNewTitle(store, payload),
          userId: getCurrentUser(store),
        })
      ).pipe(
        mapTo({ type: 'projects/titleSaved' }),
        catchError(error =>
          of({
            error: true,
            type: 'projects/titleError',
            payload: error.response.message,
            meta: { source: 'stageTitleUpdate' },
          })
        )
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
        catchError(error =>
          of({
            error: true,
            type: 'projects/stageCreationError',
            payload: error.response.message,
            meta: { source: 'newStageCreated' },
          })
        )
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
        catchError(error =>
          of({
            error: true,
            type: 'projects/stageDestructionError',
            payload: error.response.message,
            meta: { source: 'stageDestroyed' },
          })
        )
      )
    )
  );
