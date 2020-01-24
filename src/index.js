import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import { Provider } from 'react-redux';
import { SplitProvider } from 'react-splitio';
import * as serviceWorker from './serviceWorker';
import Routes from './Routes';
import { UserProvider } from './features/auth/UserContext';
import store from './utils/store';
import './index.css';
import '@duik/it/dist/styles.css';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    release: process.env.REACT_APP_VERSION,
  });
} else {
  const config = {
    rules: [{ id: 'radiogroup', enabled: true }],
  };
  // eslint-disable-next-line
  var axe = require('react-axe');
  axe(React, ReactDOM, 1000, config);
}

const SDK_CONFIG_OBJECT = {
  core: {
    authorizationKey: 'a20q0ghml02lf7kksc5ba0e1tqv1vqm5p2cp',
    key: 'CUSTOMER_ID',
    trafficType: 'A_TRAFFIC_TYPE',
  },
};

const App = () => (
  <SplitProvider config={SDK_CONFIG_OBJECT}>
    <Provider store={store}>
      <UserProvider>
        <Routes />
      </UserProvider>
    </Provider>
  </SplitProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
