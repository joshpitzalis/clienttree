import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Tree from '../../images/Tree';
import firebase from '../../utils/firebase';
import { toast$ } from '../notifications/toast';

export const AuthButton = withRouter(
  ({ history, authStatus }) =>
    authStatus && (
      <p className="f6 dib  bg-animate hover-bg-white hover-black no-underline pv2 ph4 br-pill ba b--white-20">
        <button
          type="button"
          className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
          onClick={() => {
            firebase
              .auth()
              .signOut()
              .then(() => history.push('/'))
              .catch(error =>
                toast$.next({ type: 'ERROR', message: error.message || error })
              );
          }}
        >
          Sign out
        </button>
      </p>
    )
);

const propTypes = {
  authStatus: PropTypes.bool.isRequired,
};
export function Navbar({ authStatus }) {
  return (
    <nav className="flex justify-between bb b--white-10">
      <Tree classNames="ml4 pl2 b hover-white no-underline flex items-center pa3" />
      <div className="flex-grow pa3 flex items-center">
        <AuthButton authStatus={authStatus} />
      </div>
    </nav>
  );
}

Navbar.propTypes = propTypes;
