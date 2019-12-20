import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import { createEpicMiddleware } from 'redux-observable';
import { rootReducer, rootEpic, dependencies } from './store';

function configureStore(initialState) {
  const epicMiddleware = createEpicMiddleware({ dependencies });

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
  history,
  store,
});

// adding `history and store` to the returned utilities to allow you to reference it in our tests (just try to avoid using this to test implementation details).
