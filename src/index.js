import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '@duik/it/dist/styles.css';
import { Provider } from 'react-redux';
import Routes from './Routes';
import * as serviceWorker from './serviceWorker';
import { UserProvider } from './features/auth/UserContext';
import store from './utils/store';

ReactDOM.render(
  <Provider store={store}>
    <UserProvider>
      <Routes />
    </UserProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
