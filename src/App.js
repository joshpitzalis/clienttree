import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import 'tachyons';
import {
  BrowserRouter,
  Route,
  Link,
  Redirect,
  withRouter,
} from 'react-router-dom';
import Banner, { toast$ } from './features/toast';

function Public() {
  return <h3>This is where I ask you to sign up to the waiting list...</h3>;
}

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  },
};

const AuthButton = withRouter(({ history }) =>
  fakeAuth.isAuthenticated ? (
    <p>
      Welcome!{' '}
      <button
        type="button"
        onClick={() => {
          fakeAuth.signout(() => history.push('/'));
        }}
      >
        Sign out
      </button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  )
);

const propTypes = {
  component: PropTypes.element,
  location: ReactRouterPropTypes.location.isRequired,
};

const PrivateRoute = ({ component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      fakeAuth.isAuthenticated ? (
        <component {...props} />
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

// history: ReactRouterPropTypes.history.isRequired,
// location: ReactRouterPropTypes.location.isRequired,
// match: ReactRouterPropTypes.match.isRequired,
// route: ReactRouterPropTypes.route.isRequired,

function Protected() {
  return <h3>Protected</h3>;
}

const loginPropTypes = {
  location: ReactRouterPropTypes.location.isRequired,
};

class Login extends Component {
  state = { redirectToReferrer: false };

  componentDidMount() {
    const { location } = this.props;
    toast$.next({
      type: 'ERROR',
      message: `You must log in to view the page at ${(location &&
        location.state &&
        location.state.pathname &&
        location.state.pathname) ||
        '/'}`,
    });
  }

  login = e => {
    e.preventDefault();
    fakeAuth.authenticate(() => {
      this.setState({ redirectToReferrer: true });
    });
  };

  render() {
    const { location } = this.props;
    const { from } = location.state || { from: { pathname: '/' } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) return <Redirect to={from} />;

    return (
      <div>
        <div className="pa4 black-80">
          <form className="measure center" onSubmit={this.login}>
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f4 fw6 ph0 mh0">
                Client Tree is currently invite only.
              </legend>
              <small>
                If you do not have credentials please join the waiting list.
              </small>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">
                  Email
                  <input
                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                    type="email"
                    name="email-address"
                    id="email-address"
                  />
                </label>
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">
                  Password
                  <input
                    className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                    type="password"
                    name="password"
                    id="password"
                  />
                </label>
              </div>
              {/* <label className="pa0 ma0 lh-copy f6 pointer">
                <input type="checkbox" /> Remember me
              </label> */}
            </fieldset>
            <div className="">
              <input
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Sign in"
              />
            </div>
            {/* <div className="lh-copy mt3">
              <a href="#0" className="f6 link dim black db">
                Sign up
              </a>
              <a href="#0" className="f6 link dim black db">
                Forgot your password?
              </a>
            </div> */}
          </form>
        </div>
      </div>
    );
  }
}

Login.propTypes = loginPropTypes;

const App = () => (
  <BrowserRouter>
    <main>
      <Banner />
      <AuthButton />
      <ul>
        <li>
          <Link to="/public">Landing Page</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
      </ul>
      <Route path="/public" component={Public} />
      <Route path="/login" component={Login} />
      <PrivateRoute path="/dashboard" component={Protected} />
    </main>
  </BrowserRouter>
);

export default App;
