import { switchMap, debounceTime, mapTo, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { from } from 'rxjs';
import produce from 'immer';
import { toast$ } from '../notifications/toast';

// memoize this tk
const getCurrentUser = store => store.value.user.userId;

const getDashboardWithNewTitle = (store, payload) => {
  const { dashboard } = store.value.user;
  const { title, stageId } = payload;
  // const newDashboard = { ...dashboard };
  // console.log({ stageId, newDashboard });
  // newDashboard.stages[stageId].title = title;
  // return newDashboard;
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
      )
    ),
    mapTo({ type: 'projects/fetchFulfilled' }),
    catchError(error =>
      toast$.next({ type: 'ERROR', message: error.message || error })
    )
  );
