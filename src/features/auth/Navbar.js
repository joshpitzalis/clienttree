import React from 'react';
import { withRouter } from 'react-router-dom';

const fakeAuth = {
  isAuthenticated: true,
  authenticate(cb) {
    this.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  },
};

export { fakeAuth as default };

export const AuthButton = withRouter(({ history }) =>
  fakeAuth.isAuthenticated ? (
    <p className="f6 dib  bg-animate hover-bg-white hover-black no-underline pv2 ph4 br-pill ba b--white-20">
      <button
        type="button"
        className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
        onClick={() => {
          fakeAuth.signout(() => history.push('/'));
        }}
      >
        Sign out
      </button>
    </p>
  ) : (
    <p
      className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
      // className="f6 dib  bg-animate hover-bg-white hover-black no-underline pv2 ph4 br-pill ba b--white-20"
    >
      You are not logged in.
    </p>
  )
);

export function Navbar() {
  return (
    <nav className="flex justify-between bb b--white-10">
      <p className="ml4 pl2 link small-caps b hover-white no-underline flex items-center pa3">
        Client Tree
      </p>
      <div className="flex-grow pa3 flex items-center">
        <AuthButton />
      </div>
    </nav>
  );
}
