import React, { Component } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Redirect } from 'react-router-dom';
import { toast$ } from '../features/notifications/toast';
import fakeAuth from '../features/auth/Navbar';

const loginPropTypes = {
  location: ReactRouterPropTypes.location.isRequired,
};
export class Login extends Component {
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
    if (redirectToReferrer) return <Redirect to="dashboard/123" />;
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
            </fieldset>
            <div className="">
              <input
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Sign in"
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}
Login.propTypes = loginPropTypes;
