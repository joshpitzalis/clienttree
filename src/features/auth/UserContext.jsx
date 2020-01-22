import React from 'react';
import PropTypes from 'prop-types';

import { toast$ } from '../notifications/toast';
import firebase from '../../utils/firebase';

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
        const { uid, email, metadata } = user;

        const createdAt = parseInt(+new Date(metadata.creationTime)) / 1000;

        setUid(uid);
        setAuthStatus(true);
        return (
          analytics &&
          analytics.identify(uid, {
            email,
            created_at: createdAt,
          })
        );
      }
      // tk redirect to login here
      setAuthStatus(false);
      setUid('');
    });
  }, []);

  const handleLogout = history =>
    firebase
      .auth()
      .signOut()
      .then(() => setTimeout(() => history.push('/login')), 2000)
      .catch(error =>
        toast$.next({
          type: 'ERROR',
          message: error.message || error,
        })
      );

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
