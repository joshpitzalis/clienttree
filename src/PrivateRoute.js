import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Route, Redirect } from 'react-router-dom';
import fakeAuth from './features/auth/Navbar';

const propTypes = {
  component: PropTypes.element,
  location: ReactRouterPropTypes.location.isRequired,
};
export const PrivateRoute = ({ component: Component, ...rest }) => (
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
