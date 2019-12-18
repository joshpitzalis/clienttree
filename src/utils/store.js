import { combineReducers } from 'redux';
import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import { catchError } from 'rxjs/operators';
import { taskSlice } from '../features/people/taskSlice';
import {
  updateStatsDetails,
  projectCompleted,
  leadContacted,
} from '../features/stats/statsEpic';
import {
  markActivityComplete,
  setNewUserTask,
  updateContactEpic,
} from '../features/people/networkEpics';
import { setContact } from '../features/people/peopleAPI';
import {
  userSlice,
  fetchUserDataEpic,
  contactsSlice,
} from '../pages/Dashboard';
import { onboardingEpic } from '../features/onboarding/onboardingEpics';
import {
  decrementActivityStats,
  incrementActivityStats,
} from '../features/stats/statsAPI';
import {
  stageTitleUpdate,
  newStageCreated,
  stageDestroyed,
} from '../features/projects/projectEpics';
import { toast$ } from '../features/notifications/toast';
import { updateUserProfile } from '../features/projects/dashAPI';

export const rootEpic = (action$, store$, dependencies) =>
  combineEpics(
    markActivityComplete,
    onboardingEpic,
    setNewUserTask,
    updateStatsDetails,
    projectCompleted,
    leadContacted,
    stageTitleUpdate,
    newStageCreated,
    stageDestroyed,
    fetchUserDataEpic,
    updateContactEpic
  )(action$, store$, dependencies).pipe(
    catchError((error, source) => {
      toast$.next({ type: 'ERROR', message: error.message || error });
      return source;
    })
  );

export const rootReducer = combineReducers({
  tasks: taskSlice.reducer,
  user: userSlice.reducer,
  contacts: contactsSlice.reducer,
});

const epicMiddleware = createEpicMiddleware({
  dependencies: {
    decrementActivityStats,
    incrementActivityStats,
    track: window && window.analytics && window.analytics.track,
    updateUserProfile,
    setContact,
  },
});

const middleware =
  process.env.NODE_ENV !== 'production'
    ? [
        // eslint-disable-next-line global-require
        require('redux-immutable-state-invariant').default(),
        ...getDefaultMiddleware(),
        epicMiddleware,
      ]
    : [...getDefaultMiddleware(), epicMiddleware];

const store = configureStore({
  reducer: rootReducer,
  middleware,
});

epicMiddleware.run(rootEpic);

export default store;
