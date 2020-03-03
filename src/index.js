import '@duik/it/dist/styles.css';
import * as Sentry from '@sentry/browser';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { UserProvider } from './features/auth/UserContext';
import './index.css';
// import * as serviceWorker from './serviceWorker';
import Routes from './Routes';
import store from './utils/store';

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
  var axe = require("react-axe");
  axe(React, ReactDOM, 1000, config);
}
console.log(`Version: ${process.env.REACT_APP_VERSION}`);

const App = () => (
  <Provider store={store}>
    <UserProvider>
      <Routes />
    </UserProvider>
  </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
