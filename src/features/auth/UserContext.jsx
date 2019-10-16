import React from 'react';
import PropTypes from 'prop-types';

import firebase from '../../utils/firebase';
import { toast$ } from '../notifications/toast';

const UserContext = React.createContext();

const propTypes = {
  children: PropTypes.element.isRequired,
};
const defaultProps = {};

const UserProvider = ({ children }) => {
  const [authStatus, setAuthStatus] = React.useState(false);
  const [userId, setUid] = React.useState('');

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const { analytics } = window;
        const { uid, email } = user;
        analytics.identify(uid, {
          email,
        });
        setUid(uid);
        setAuthStatus(true);
      } else {
        // tk redirect to login here
        setAuthStatus(false);
        setUid('');
      }
    });
  }, []);

  const handleLogout = history => {
    firebase
      .auth()
      .signOut()
      .then(() => history.push('/'))
      .catch(error =>
        toast$.next({
          type: 'ERROR',
          message: error.message || error,
        })
      );
  };

  return (
    <UserContext.Provider
      value={{
        authStatus,
        userId,
        handleLogout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };

UserProvider.propTypes = propTypes;
UserProvider.defaultProps = defaultProps;
