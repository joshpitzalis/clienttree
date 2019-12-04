import React from 'react';
import { Provider } from 'react-redux';
import Routes from './Routes';
import { UserProvider } from './features/auth/UserContext';
import store from './utils/store';
import './index.css';
import '@duik/it/dist/styles.css';

export const App = () => (
  <Provider store={store}>
    <UserProvider>
      <Routes />
    </UserProvider>
  </Provider>
);
