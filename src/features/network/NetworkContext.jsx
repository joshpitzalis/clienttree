import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { toast$ } from '../notifications/toast';
import { setFirebaseContactUpdate, getFirebaseContacts } from './networkAPI';

const NetworkContext = React.createContext();

const propTypes = {
  children: PropTypes.element.isRequired,
  uid: PropTypes.string.isRequired,
};

const defaultProps = {};

const NetworkProvider = ({ children, uid }) => {
  const [contacts, setContacts] = React.useState([]);

  React.useEffect(() => {
    if (uid) {
      getFirebaseContacts(uid)
        .then(network => setContacts(network))
        .catch(error =>
          toast$.next({
            type: 'ERROR',
            message: error.message || error,
          })
        );
    }
  }, [uid]);

  const setContact = contact =>
    setFirebaseContactUpdate(contact).catch(error =>
      toast$.next({ type: 'ERROR', message: error.message || error })
    );

  return (
    <NetworkContext.Provider
      value={{
        contacts,
        setContact,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export { NetworkProvider, NetworkContext };

NetworkProvider.propTypes = propTypes;
NetworkProvider.defaultProps = defaultProps;

// React.useEffect(() => {
//   if (uid) {
//     fetchUserData(uid)
//       .then(data => {
//         if (data) {
//           dispatch({
//             type: 'HYDRATE_PROFILE',
//             payload: data,
//           });
//         }
//       })
//       .catch(error =>
//         toast$.next({ type: 'ERROR', message: error.message || error })
//       );
//   }
// }, [uid]);
// React.useEffect(() => {
//   const updates = personFormUpdate$
//     .pipe(
//       debounceTime(1000),
//       tap(({ payload }) => {
//         handleFirebaseProfileUpdate(payload).catch(error =>
//           toast$.next({ type: 'ERROR', message: error.message || error })
//         );
//       })
//     )
//     .subscribe();
//   return () => updates.unsubscribe();
// }, []);
