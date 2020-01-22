import React from 'react';
import PropTypes from 'prop-types';
import './networkAnimations.css';
import { useSelector, useDispatch } from 'react-redux';
import { Person } from './components/Person';
import { PersonModal } from './components/PersonBox';
// import { AddButton } from './components/AddButton';
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
  const dispatch = useDispatch();
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
              newPerson
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setSelectedUser(newDoc.id);
                dispatch({
                  type: 'people/setSelectedUser',
                  payload: newDoc.id,
                });
                setVisibility(true);
              }}
              className="btn1 b grow  ph3 pv2  pointer bn br1 white"
              data-testid="addPeopleButton"
            >
              Add Someone New
            </button>
          )}
        </div>
        <ContactsBox contacts={contacts} uid={uid}></ContactsBox>
      </>
    </ErrorBoundary>
  );
}
_Network.propTypes = networkPropTypes;
_Network.defaultProps = networkDefaultProps;

export const Network = React.memo(_Network);

export default function ContactsBox({ contacts, uid }) {
  if (!contacts) {
    return <p data-testid="loader">Loading...</p>;
  }
  return (
    <React.Fragment>
      {contacts.length ? (
        <ul className="list pl0 mt0">
          {contacts.map(
            contact =>
              contact.uid && (
                <Person key={contact.uid} contact={contact} uid={uid} />
              )
          )}
        </ul>
      ) : (
        <p data-testid="emptyContacts">No Contacts Yet.</p>
      )}
    </React.Fragment>
  );
}
