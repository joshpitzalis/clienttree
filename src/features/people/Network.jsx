import React from 'react';
import PropTypes from 'prop-types';

import './networkAnimations.css';
import { useSelector } from 'react-redux';
import { Person } from './components/Person';

import { PersonModal } from './components/PersonBox';

import { AddButton } from './components/AddButton';
import ErrorBoundary from '../../utils/ErrorBoundary';
import firebase from '../../utils/firebase';

// import { Button } from '@duik/it';
// import Portal from '../../utils/Portal';
// import { Modal } from './components/ContactModal';
// import { NetworkContext } from './NetworkContext';
const networkPropTypes = {
  uid: PropTypes.string.isRequired,
};
const networkDefaultProps = {};

function _Network({ uid }) {
  const [visible, setVisibility] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState('');

  /** @type {[{
    uid: string,
    lastContacted: number,
    activeTaskCount: number,
    name: string,
    photoURL: string
  }]} contact */
  const contacts = useSelector(store => store.contacts);

  const newDoc = firebase
    .firestore()
    .collection('users')
    .doc(uid)
    .collection('contacts')
    .doc();

  return (
    <ErrorBoundary fallback="Oh no! This bit is broken 🤕">
      <>
        <div className="pv4" data-testid="outreachPage">
          {visible ? (
            <PersonModal
              uid={uid}
              contactId={selectedUser}
              onClose={() => {
                setVisibility(false);
                setSelectedUser('');
              }}
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setSelectedUser(newDoc.id);
                setVisibility(true);
              }}
              className="btn1 b grow  ph3 pv2  pointer bn br1 white"
              data-testid="addPeopleButton"
            >
              Add Someone New
            </button>
          )}
        </div>
        <ul className="list pl0 mt0">
          {contacts &&
            contacts.map(
              contact =>
                contact.uid && (
                  <Person key={contact.uid} contact={contact} uid={uid} />
                )
            )}
        </ul>
      </>
    </ErrorBoundary>
  );
}
_Network.propTypes = networkPropTypes;
_Network.defaultProps = networkDefaultProps;

export const Network = React.memo(_Network);
