import React from 'react';
import 'tachyons';
import { BrowserRouter, Route } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import ReactRouterPropTypes from 'react-router-prop-types';

import { Navbar } from './features/auth/Navbar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
// import { PrivateRoute } from './features/auth/PrivateRoute';
import Refer from './features/profile/Referral';
import { UserContext } from './features/auth/UserContext';
import Banner from './features/notifications/toast';
import { NetworkProvider } from './features/people/NetworkContext';
import ErrorBoundary from './utils/ErrorBoundary';

const propTypes = {
  // location: ReactRouterPropTypes.location.isRequired,
};

const App = () => {
  const { authStatus, userId } = React.useContext(UserContext);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <>
          <Banner />
          <Navbar authStatus={authStatus} />
          <main>
            <Route
              exact
              path="/"
              render={routeProps => (
                <Login
                  {...routeProps}
                  authStatus={authStatus}
                  userId={userId}
                />
              )}
            />
            <Route
              exact
              path="/login"
              render={loginProps => (
                <Login
                  {...loginProps}
                  authStatus={authStatus}
                  userId={userId}
                />
              )}
            />
            {userId && (
              <NetworkProvider uid={userId}>
                <Route
                  path="/user/:uid"
                  render={dashProps => (
                    <Dashboard
                      {...dashProps}
                      userId={userId}
                      authStatus={authStatus}
                    />
                  )}
                />
              </NetworkProvider>
            )}
            <Route
              exact
              path="/refer/:uid"
              render={referProps => <Refer {...referProps} userId={userId} />}
            />
          </main>
        </>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;

App.propTypes = propTypes;
