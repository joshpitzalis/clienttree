import React from 'react';
import 'tachyons';
import { BrowserRouter, Route } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import ReactRouterPropTypes from 'react-router-prop-types';
import Banner from './features/notifications/toast';
import { Navbar } from './features/auth/Navbar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { PrivateRoute } from './features/auth/PrivateRoute';
import firebase from './utils/firebase';
import Refer from './features/services/Referral';

const propTypes = {
  // location: ReactRouterPropTypes.location.isRequired,
};

const App = props => {
  const [authStatus, setAuthStatus] = React.useState(true);
  const [userId, setUid] = React.useState('');

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const { uid } = user;
        setUid(uid);
        setAuthStatus(true);
      } else {
        setAuthStatus(false);
        setUid('');
      }
    });
  }, []);

  return (
    <BrowserRouter>
      <main>
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
        <PrivateRoute
          path="/user/:uid"
          authStatus={false || authStatus}
          component={Dashboard}
        />
        <Route exact path="/refer/:uid" component={Refer} />
      </main>
    </BrowserRouter>
  );
};

export default App;

App.propTypes = propTypes;
