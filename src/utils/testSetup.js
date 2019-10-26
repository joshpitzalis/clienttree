import { render as rtlRender } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import React from 'react';
import { rootReducer } from './store';

export const render = (
  ui,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
    initialState,
    store = createStore(rootReducer, initialState),
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
