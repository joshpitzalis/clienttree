import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import 'tachyons';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import Banner from './features/notifications/toast';
import fakeAuth, { Navbar } from './features/auth/Navbar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';

const propTypes = {
  component: PropTypes.element,
  location: ReactRouterPropTypes.location.isRequired,
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      fakeAuth.isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

PrivateRoute.propTypes = propTypes;

const App = () => (
  <BrowserRouter>
    <main>
      <Banner />
      <Navbar />

      <Route exact path="/" component={Dashboard} />
      <Route exact path="/login" component={Login} />
      <PrivateRoute exact path="/dashboard/:uid" component={Dashboard} />
    </main>
  </BrowserRouter>
);

export default App;
