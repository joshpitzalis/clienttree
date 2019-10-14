import React from 'react';
import PropTypes from 'prop-types';
import { collection } from 'rxfire/firestore';
import { map, catchError } from 'rxjs/operators';
import { setFirebaseContactUpdate } from './networkAPI';
import firebase from '../../utils/firebase';
import { toast$ } from '../notifications/toast';

const NetworkContext = React.createContext();

const propTypes = {
  children: PropTypes.element.isRequired,
  uid: PropTypes.string.isRequired,
};

const defaultProps = {};

const NetworkProvider = ({ children, uid }) => {
  const [contacts, setContacts] = React.useState([]);

  React.useEffect(() => {
    const subscription = collection(
      firebase
        .firestore()
        .collection('users')
        .doc(uid)
        .collection('contacts')
    )
      .pipe(
        map(docs => docs.map(d => d.data())),
        catchError(error =>
          toast$.next({ type: 'ERROR', message: error.message || error })
        )
      )
      .subscribe(network => setContacts(network));
    return () => subscription.unsubscribe();
  }, [uid]);

  const setContact = contact => {
    try {
      setFirebaseContactUpdate(contact);
    } catch (error) {
      toast$.next({ type: 'ERROR', message: error.message || error });
    }
  };

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
