import { OptimizelyFeature } from '@optimizely/react-sdk';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ErrorBoundary from '../../utils/ErrorBoundary';
import firebase from '../../utils/firebase';
import { ContactImporter } from '../contactImport/ContactImporter';
import { InsightsBox } from '../insights/InsightsBox';
import { Person } from './components/Person';
import { PersonModal } from './components/PersonBox';
import './networkAnimations.css';
import { sortContacts } from './peopleHelpers/network.helpers';

export const InnerNetwork = ({ uid }) => {
  const dispatch = useDispatch();

  const [visible, setVisibility] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState('');

  // const allContacts = [
  //   {
  //     uid: '123',
  //     name: 'Jojo',
  //     photoURL: 'http://tachyons.io/img/avatar_1.jpg',
  //     bucket: 'active',
  //     email: 'kk',
  //   },
  //   {
  //     uid: '1234',
  //     name: 'Rabbit',
  //     photoURL: 'http://tachyons.io/img/avatar_1.jpg',
  //     bucket: 'archived',
  //     email: 'kk',
  //   },
  // ];

  const allContacts = useSelector(
    store =>
      store &&
      store.contacts &&
      sortContacts(store.contacts.filter(contact => contact && contact.uid))
  );

  React.useEffect(() => {
    const { gapi } = window;
    gapi.load('client', () =>
      gapi.client.init({
        apiKey: process.env.REACT_APP_API_KEY,
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        discoveryDocs: [
          'https://www.googleapis.com/discovery/v1/apis/people/v1/rest',
        ],
        scope: 'https://www.googleapis.com/auth/contacts.readonly',
      })
    );
  }, []);

  const newDoc = firebase
    .firestore()
    .collection('users')
    .doc(uid)
    .collection('contacts')
    .doc();

  return (
    <ErrorBoundary fallback="Oh no! This bit is broken 🤕">
      <>
        <OptimizelyFeature feature="insights">
          {insights => insights && <InsightsBox />}
        </OptimizelyFeature>
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
          <ContactImporter uid={uid} allContacts={allContacts}>
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
              className="btn3 b grow black tl pv2  pointer bn br1 white"
              data-testid="addPeopleButton"
            >
              Add Someone New
            </button>
          </ContactImporter>
        )}
        <ActiveContactList contacts={allContacts} uid={uid} />
      </>
    </ErrorBoundary>
  );
};

const WrappedNetwork = props => (
  <OptimizelyFeature feature="contactChunks">
    {isEnabled => <InnerNetwork {...props} contactChunks={isEnabled} />}
  </OptimizelyFeature>
);

export const Network = React.memo(WrappedNetwork);

const ActiveContactList = ({ contacts, uid }) => {
  if (!contacts) {
    return <p data-testid="loader">Loading...</p>;
  }

  if (contacts.length) {
    return (
      <ul className="list pl0 mt0 pb4">
        {contacts.map(contact => (
          <Person key={contact.uid} contact={contact} uid={uid} />
        ))}
      </ul>
    );
  }

  return <p data-testid="emptyContacts">No Contacts Yet.</p>;
};
