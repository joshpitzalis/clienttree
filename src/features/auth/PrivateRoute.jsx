import React from 'react'
import PropTypes from 'prop-types'
import ReactRouterPropTypes from 'react-router-prop-types'
import { Route, Redirect } from 'react-router-dom'

const propTypes = {
  component: PropTypes.func.isRequired,
  location: ReactRouterPropTypes.location,
  authStatus: PropTypes.bool
}

const defaultProps = { authStatus: false }

export const PrivateRoute = ({ component: Component, authStatus, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      authStatus ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location }
          }}
        />
      )}
  />
)
PrivateRoute.propTypes = propTypes
PrivateRoute.defaultProps = defaultProps
