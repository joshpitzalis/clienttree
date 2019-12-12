import {
  switchMap,
  debounceTime,
  mapTo,
  catchError,
  mergeMap,
  ignoreElements,
  tap,
} from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { from, of, concat, merge } from 'rxjs';
import produce from 'immer';
import { toast$ } from '../notifications/toast';

// memoize this tk
const getCurrentUser = store => store.value.user.userId;

const getDashboardWithNewTitle = (store, payload) => {
  const { dashboard } = store.value.user;
  const { title, stageId } = payload;
  return produce(dashboard, draft => {
    draft.stages[stageId].title = title;
  });
};

export const stageTitleUpdate = (action$, store, { setTitle }) =>
  action$.pipe(
    ofType('projects/updateTitle'),
    debounceTime(1000),
    switchMap(({ payload }) =>
      from(
        setTitle({
          dashboard: getDashboardWithNewTitle(store, payload),
          userId: getCurrentUser(store),
        })
      ).pipe(
        mapTo({ type: 'projects/titleSaved' }),
        catchError(error => ({
          type: 'projects/titleError',
          payload: error,
        }))
      )
    )
  );
