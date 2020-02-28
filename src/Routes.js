import React from 'react';
import { BrowserRouter, Route, Link, withRouter } from 'react-router-dom';
import 'tachyons';
import { Dropdown, DropdownItem } from '@duik/it';
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
import Logout from './images/Logout';
import Profile from './images/Profile';

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
          {/* <Footer /> */}
        </BrowserRouter>
      </ErrorBoundary>
    </OptimizelyProvider>
  );
};

export default App;

App.propTypes = propTypes;

const Footer = ({ history }) => {
  const { userId, authStatus, handleLogout } = React.useContext(UserContext);

  return (
    <OptimizelyFeature feature="workboard">
      {workboard =>
        !workboard && (
          <footer className="bg-black white-80 pv5 pv6-l ph4 tc">
            {authStatus && (
              <OptimizelyFeature feature="referralPage">
                {referralPage => {
                  if (referralPage) {
                    return (
                      <Dropdown
                        // ButtonComponent={DropDownIcon}
                        buttonText="Settings"
                        data-testid="settings"
                        buttonProps={{
                          clear: true,
                          closeOnOptionClick: true,
                        }}
                        className="white-80 f5"
                      >
                        {({ handleClose }) => (
                          <div onMouseLeave={handleClose}>
                            <div className="dn db-ns">
                              <DropdownItem
                                Component={Link}
                                to={`/user/${userId}/profile`}
                                data-testid="goToProfilePage"
                              >
                                <Profile className="" />{' '}
                                <p className="tracked pl2">Profile</p>
                              </DropdownItem>
                            </div>
                            <DropdownItem onClick={() => handleLogout(history)}>
                              <Logout className="" />{' '}
                              <p className="tracked pl2">Logout</p>
                            </DropdownItem>
                          </div>
                        )}
                      </Dropdown>
                    );
                  }
                  return (
                    <button
                      className="bn pointer grow"
                      type="button"
                      onClick={() => handleLogout(history)}
                    >
                      <p className="tracked">Logout</p>
                    </button>
                  );
                }}
              </OptimizelyFeature>
            )}

            <p className="">
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
        )
      }
    </OptimizelyFeature>
  );
};
