import React from 'react';
import 'tachyons';
import { BrowserRouter, Route } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import ReactRouterPropTypes from 'react-router-prop-types';
import { Navbar } from './features/auth/Navbar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
// import { PrivateRoute } from './features/auth/PrivateRoute';
import Refer from './features/services/Referral';
import { UserContext } from './features/auth/UserContext';
import Banner from './features/notifications/toast';
import { NetworkProvider } from './features/network/NetworkContext';

const propTypes = {
  // location: ReactRouterPropTypes.location.isRequired,
};

const App = () => {
  const { authStatus, userId } = React.useContext(UserContext);

  return (
    <BrowserRouter>
      <main>
        <div className="">
          <Banner />
          <Navbar authStatus={authStatus} />
          <Route
            exact
            path="/"
            render={routeProps => (
              <Login {...routeProps} authStatus={authStatus} userId={userId} />
            )}
          />
          <Route
            exact
            path="/login"
            render={loginProps => (
              <Login {...loginProps} authStatus={authStatus} userId={userId} />
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
          <p className="tc f6">Version 0.0.5</p>
        </div>
      </main>
    </BrowserRouter>
  );
};

export default App;

App.propTypes = propTypes;
