import { combineReducers } from 'redux';
import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import { taskSlice } from '../features/network/taskSlice';
import { updateUserDetails } from '../features/stats/statsEpic';
import {
  markActivityComplete,
  setNewUserTask,
} from '../features/network/networkEpics';
import { userSlice } from '../pages/Dashboard';
import { onboardingEpic } from '../features/onboarding/onboardingEpics';

export const rootEpic = combineEpics(
  markActivityComplete,
  updateUserDetails,
  onboardingEpic,
  setNewUserTask
);

export const rootReducer = combineReducers({
  tasks: taskSlice.reducer,
  user: userSlice.reducer,
});

const epicMiddleware = createEpicMiddleware();

const store = configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware(), epicMiddleware],
});

epicMiddleware.run(rootEpic);

export default store;
