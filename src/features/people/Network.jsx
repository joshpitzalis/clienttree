import React from 'react';
import PropTypes from 'prop-types';

import './networkAnimations.css';
import { useSelector } from 'react-redux';
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
  const [selectedUser, setSelectedUser] = React.useState('');
  const contacts = useSelector(store => store.contacts);

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
      <>
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
              contactCount={contacts && contacts.filter(c => c.uid).length}
            />
          )}
        </div>
        <ul className="list pl0 mt0">
          {contacts &&
            contacts.map(
              contact =>
                contact.uid && (
                  <Person
                    key={contact.uid}
                    setSelectedUser={setSelectedUser}
                    setVisibility={setVisibility}
                    contact={contact}
                    selectedUser={selectedUser}
                  />
                )
            )}
        </ul>
      </>
    </ErrorBoundary>
  );
}
Network.propTypes = networkPropTypes;
Network.defaultProps = networkDefaultProps;
