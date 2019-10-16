import { combineReducers } from 'redux';
import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import { taskSlice } from '../features/network/taskSlice';

import { markActivityComplete } from '../features/network/networkEpics';

const rootEpic = combineEpics(markActivityComplete);

const rootReducer = combineReducers({
  tasks: taskSlice.reducer,
});

const epicMiddleware = createEpicMiddleware();

const store = configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware(), epicMiddleware],
});

epicMiddleware.run(rootEpic);

export default store;
