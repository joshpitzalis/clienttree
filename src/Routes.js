import React from 'react';
import 'tachyons';
import { BrowserRouter, Route } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import ReactRouterPropTypes from 'react-router-prop-types';
import Banner from './features/notifications/toast';
import { Navbar } from './features/auth/Navbar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
// import { PrivateRoute } from './features/auth/PrivateRoute';
import firebase from './utils/firebase';
import Refer from './features/services/Referral';
import { UserContext } from './features/auth/UserContext';

const propTypes = {
  // location: ReactRouterPropTypes.location.isRequired,
};

const App = () => {
  const [authStatus, setAuthStatus] = React.useState(false);
  const [userId, setUid] = React.useState('');

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const { uid } = user;
        setUid(uid);
        setAuthStatus(true);
      } else {
        // tk redirect to login here
        setAuthStatus(false);
        setUid('');
      }
    });
  }, []);

  return (
    <BrowserRouter>
      <main>
        <UserContext.Provider value={authStatus}>
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
          <Route
            exact
            path="/refer/:uid"
            render={referProps => <Refer {...referProps} userId={userId} />}
          />
        </UserContext.Provider>
      </main>
    </BrowserRouter>
  );
};

export default App;

App.propTypes = propTypes;
