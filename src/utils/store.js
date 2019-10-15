import { combineReducers } from 'redux';
import { configureStore } from 'redux-starter-kit';
import { taskSlice } from '../features/network/taskSlice';

const rootReducer = combineReducers({
  tasks: taskSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
