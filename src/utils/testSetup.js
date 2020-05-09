import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { createEpicMiddleware } from 'redux-observable';
import { createInstance, OptimizelyProvider } from '@optimizely/react-sdk';
import { rootReducer, rootEpic, dependencies } from './store';

function configureStore(initialState) {
  const epicMiddleware = createEpicMiddleware({ dependencies });

  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(epicMiddleware)
  )

  epicMiddleware.run(rootEpic)

  return store
}

const optimizely = createInstance({
  sdkKey: process.env.REACT_APP_ROLLOUT,
});

export const render = (
  ui,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
    initialState = {},
    store = configureStore(initialState),
    ...renderOptions
  } = {}
) => ({
  ...rtlRender(
    <Provider store={store}>
      <Router history={history}>
        <OptimizelyProvider
          optimizely={optimizely}
          user={{
            id: 'hiaCOgc7xWgoVf6gsqkmNIWmjgs2',
            attributes: {
              id: 'hiaCOgc7xWgoVf6gsqkmNIWmjgs2',
            },
          }}
        >
          {ui}
        </OptimizelyProvider>
      </Router>
    </Provider>,
    renderOptions
  ),
  history,
  store
})

// adding `history and store` to the returned utilities to allow you to reference it in our tests ( avoid using this to test implementation details).
