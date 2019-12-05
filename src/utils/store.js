import { combineReducers } from 'redux';
import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import { taskSlice } from '../features/network/taskSlice';
import {
  updateStatsDetails,
  projectCompleted,
  leadContacted,
} from '../features/stats/statsEpic';
import {
  markActivityComplete,
  setNewUserTask,
} from '../features/network/networkEpics';
import { userSlice } from '../pages/Dashboard';
import { onboardingEpic } from '../features/onboarding/onboardingEpics';

import {
  decrementActivityStats,
  incrementActivityStats,
} from '../features/stats/statsAPI';

export const rootEpic = combineEpics(
  markActivityComplete,
  onboardingEpic,
  setNewUserTask,
  updateStatsDetails,
  projectCompleted,
  leadContacted
);

export const rootReducer = combineReducers({
  tasks: taskSlice.reducer,
  user: userSlice.reducer,
});

const epicMiddleware = createEpicMiddleware({
  dependencies: {
    decrementActivityStats,
    incrementActivityStats,
    track: window && window.analytics && window.analytics.track,
  },
});
// Be sure to ONLY add this middleware in development!
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
