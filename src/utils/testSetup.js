import { render as rtlRender } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import React from 'react';
import { createEpicMiddleware } from 'redux-observable';
import { rootReducer, rootEpic, dependencies } from './store';
// import {
//   decrementActivityStats,
//   incrementActivityStats,
// } from '../features/stats/statsAPI';
// import { updateUserProfile } from '../features/projects/dashAPI';
// import { setContact } from '../features/people/peopleAPI';
const epicMiddleware = createEpicMiddleware({ dependencies });

function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(epicMiddleware)
  );

  epicMiddleware.run(rootEpic);

  return store;
}

export const render = (
  ui,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
    initialState,
    store = configureStore(initialState),
    ...renderOptions
  } = {}
) => ({
  ...rtlRender(
    <Provider store={store}>
      <Router history={history}>{ui}</Router>
    </Provider>,
    renderOptions
  ),
  // adding `history` to the returned utilities to allow us
  // to reference it in our tests (just try to avoid using
  // this to test implementation details).
  history,
  // adding `store` to the returned utilities to allow us
  // to reference it in our tests (just try to avoid using
  // this to test implementation details).
  store,
});
