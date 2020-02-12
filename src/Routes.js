import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import 'tachyons';
// import PropTypes from 'prop-types';
// import ReactRouterPropTypes from 'react-router-prop-types';
import {
  createInstance,
  OptimizelyProvider,
  OptimizelyFeature,
} from '@optimizely/react-sdk';
// import FeatureFlags from './features/featureboard';
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

const optimizely = createInstance({
  sdkKey: process.env.REACT_APP_ROLLOUT,
});

const App = () => {
  const { authStatus, userId } = React.useContext(UserContext);

  return (
    <OptimizelyProvider
      optimizely={optimizely}
      user={{
        id: userId,
        attributes: {
          id: userId,
        },
      }}
    >
      <ErrorBoundary>
        <BrowserRouter>
          <div className="bg-base">
            <Banner />
            <Navbar authStatus={authStatus} />
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
          </div>
        </BrowserRouter>
      </ErrorBoundary>

      <OptimizelyFeature feature="insights">
        {insights => insights && <Footer />}
      </OptimizelyFeature>
    </OptimizelyProvider>
  );
};

export default App;

App.propTypes = propTypes;

function Footer() {
  return (
    <footer className="bg-black white-80 pv5 pv6-l ph4 tc">
      <p className="f5">
        <a className="link white-80 hover-light-purple" href="/terms">
          Terms
        </a>{' '}
        /
        <a className="link white-80 hover-gold" href="/privacy">
          {' '}
          Privacy{' '}
        </a>{' '}
        /
        <a className="link white-80 hover-green" href="/contact">
          Contact
        </a>
      </p>
      <span className="db f6 text3">
        ©2020 Client Tree. Version {process.env.REACT_APP_VERSION}
      </span>
    </footer>
  );
}
