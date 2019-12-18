import React from 'react';
import PropTypes from 'prop-types';
import { map, catchError } from 'rxjs/operators';
import { toast$ } from '../notifications/toast';
import { unfinishedTasks$, contacts$ } from './peopleStreams';
import './networkAnimations.css';
import { Person } from './components/Person';

import { PersonModal } from './components/PersonBox';

import { AddButton } from './components/AddButton';
import ErrorBoundary from '../../utils/ErrorBoundary';
// import { Button } from '@duik/it';
// import Portal from '../../utils/Portal';
// import { Modal } from './components/ContactModal';
// import { NetworkContext } from './NetworkContext';

const networkPropTypes = {
  uid: PropTypes.string.isRequired,
};
const networkDefaultProps = {};

export function Network({ uid }) {
  const [visible, setVisibility] = React.useState(false);

  const [contacts, setContacts] = React.useState([]);

  const [selectedUser, setSelectedUser] = React.useState('');

  const [, setTasksCompleted] = React.useState(0);

  React.useEffect(() => {
    const contactSubscription = contacts$(uid)
      .pipe(
        map(docs => docs.map(d => d.data())),
        catchError(error =>
          toast$.next({ type: 'ERROR', message: error.message || error })
        )
      )
      .subscribe(network => setContacts(network));
    const taskSubscription = unfinishedTasks$(uid)
      .pipe(map(docs => docs.map(d => d.data())))
      .subscribe(tasks => setTasksCompleted(tasks.length));
    return () => {
      taskSubscription.unsubscribe();
      contactSubscription.unsubscribe();
    };
  }, [uid]);

  return (
    <ErrorBoundary fallback="Oh no! This bit is broken 🤕">
      {/* {visible && (
        <Portal
          onClose={() => {
            setVisibility(false);
            setSelectedUser('');
          }}
        >
          <PersonModal
            setVisibility={setVisibility}
            uid={uid}
            selectedUserUid={selectedUser}
            onClose={() => {
              setVisibility(false);
              setSelectedUser('');
            }}
          />
        </Portal>
      )} */}

      <div className="pv4" data-testid="outreachPage">
        {visible ? (
          <PersonModal
            setVisibility={setVisibility}
            uid={uid}
            selectedUserUid={selectedUser}
            onClose={() => {
              setVisibility(false);
              setSelectedUser('');
            }}
          />
        ) : (
          <AddButton
            setVisibility={setVisibility}
            contactCount={contacts.filter(c => c.uid).length}
          />
        )}
      </div>
      <ul className="list pl0 mt0">
        {contacts &&
          contacts.map(
            contact =>
              contact.uid && (
                <Person
                  setSelectedUser={setSelectedUser}
                  setVisibility={setVisibility}
                  contact={contact}
                  selectedUser={selectedUser}
                />
              )
          )}
      </ul>
    </ErrorBoundary>
  );
}
Network.propTypes = networkPropTypes;
Network.defaultProps = networkDefaultProps;
