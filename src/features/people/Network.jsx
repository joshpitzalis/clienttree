import React from 'react';
import PropTypes from 'prop-types';
import './networkAnimations.css';
import { useSelector, useDispatch } from 'react-redux';
import { OptimizelyFeature } from '@optimizely/react-sdk';
import { Menu, Dropdown, Icon } from 'antd';
import ImportContacts, { PickContacts } from '../contacts/Contacts';
import { Person } from './components/Person';
import { PersonModal } from './components/PersonBox';
import ErrorBoundary from '../../utils/ErrorBoundary';
import firebase from '../../utils/firebase';
import { InsightsBox } from '../insights/InsightsBox';
import { HelpfulTaskList } from './components/UniversalTaskList';
import GoogleImport from '../contacts/components/GoogleImport';
import { ConflictScreen } from '../contacts/components/ConflictScreen';
import { updateContact } from '../contacts/contacts.api.js';

const networkPropTypes = {
  uid: PropTypes.string.isRequired,
};
const networkDefaultProps = {};

const sortContacts = contacts => {
  const lastContact = contact => {
    const { lastContacted, notes } = contact;

    const noteDates =
      notes &&
      Object.values(notes)
        .map(note => note && note.lastUpdated)
        .filter(item => item !== 9007199254740991);

    const mostRecentNote = noteDates && Math.max(...noteDates);

    return Math.max(lastContacted, mostRecentNote);
  };

  const compare = (a, b) => {
    if (lastContact(a) < lastContact(b)) {
      return -1;
    }
    if (lastContact(a) > lastContact(b)) {
      return 1;
    }
    return 0;
  };

  return (
    contacts &&
    contacts
      .filter(
        item =>
          !!item.lastContacted && (!item.bucket || item.bucket === 'active')
      )
      .sort(compare)
  );
};

// const sortImportedContacts = contacts =>
//   contacts &&
//   contacts.filter(item => !!item.lastContacted && item.bucket === 'archived');

export const InnerNetwork = ({ uid, contactChunks }) => {
  const [conflicts, setConflicts] = React.useState([]);

  const [contactPicker, setContactPicker] = React.useState(false);
  console.log({ contactPicker });

  const [visible, setVisibility] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState('');
  const contacts = useSelector(
    store => store && store.contacts && sortContacts(store.contacts)
  );
  const allContacts = useSelector(
    store =>
      store &&
      store.contacts &&
      store.contacts.filter(contact => contact && contact.uid)
  );
  const dispatch = useDispatch();
  const newDoc = firebase
    .firestore()
    .collection('users')
    .doc(uid)
    .collection('contacts')
    .doc();

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

  const menu = (
    <Menu>
      <Menu.Item key="0">
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
          className="btn3 b grow  tl pv2  pointer bn br1 white"
          data-testid="addPeopleButton"
        >
          Add Someone New
        </button>
      </Menu.Item>
      <Menu.Item key="1">
        {/* <PickContacts
          userId={uid}
          allContacts={allContacts}
          count={
            allContacts &&
            allContacts.filter(item => item.bucket === 'archived').length
          }
        /> */}
        <GoogleImport
          userId={uid}
          existingContacts={allContacts}
          setConflicts={setConflicts}
          setContactPicker={setContactPicker}
        >
          <ImportContacts userId={uid} existingContacts={contacts} />
        </GoogleImport>
      </Menu.Item>
      {/* <Menu.Divider />
      <GoogleImport
        userId={uid}
        existingContacts={allContacts}
        setConflicts={setConflicts}
        setContactPicker={setContactPicker}
      >
        <ImportContacts userId={uid} existingContacts={contacts} />
      </GoogleImport> */}
    </Menu>
  );

  const dispatcher = _value => {
    console.log({ _value });

    if (_value === 'CLOSED') {
      setConflicts([]);
    }

    if (_value === 'COMPLETED') {
      setConflicts([]);
      setContactPicker(true);
    }

    if (_value.type === 'DUPLICATE_SELECTED') {
      const { payload } = _value;

      updateContact(uid, payload);
    }

    if (_value.type === 'EXISTING_SELECTED') {
      return null;
    }

    return null;
  };

  return (
    <ErrorBoundary fallback="Oh no! This bit is broken 🤕">
      <>
        {conflicts && !!conflicts.length && (
          <ConflictScreen
            send={dispatcher}
            duplicates={conflicts}
            existingContacts={allContacts}
            setDuplicates={setConflicts}
          ></ConflictScreen>
        )}

        <OptimizelyFeature feature="insights">
          {insights =>
            insights && (
              <article className="text2">
                <InsightsBox />
                {/* <h1 className="text2">This Week</h1>
                <UniversalTaskList myUid={uid} insights={insights} /> */}
              </article>
            )
          }
        </OptimizelyFeature>
        <>
          {contactPicker && (
            <PickContacts
              userId={uid}
              allContacts={allContacts}
              alreadyImported
              count={
                allContacts &&
                allContacts.filter(item => item.bucket === 'archived').length
              }
            />
          )}
        </>
        <OptimizelyFeature feature="workboard">
          {workboard =>
            !workboard && <HelpfulTaskList myUid={uid} insights={workboard} />
          }
        </OptimizelyFeature>

        {contactChunks ? (
          <NewImport
            visible={visible}
            uid={uid}
            selectedUser={selectedUser}
            setVisibility={setVisibility}
            setSelectedUser={setSelectedUser}
            menu={menu}
          />
        ) : (
          <OldImport
            visible={visible}
            uid={uid}
            selectedUser={selectedUser}
            setVisibility={setVisibility}
            setSelectedUser={setSelectedUser}
            dispatch={dispatch}
            contacts={contacts}
            newDoc={newDoc}
          />
        )}

        <ContactsBox contacts={contacts} uid={uid}></ContactsBox>
      </>
    </ErrorBoundary>
  );
};
InnerNetwork.propTypes = networkPropTypes;
InnerNetwork.defaultProps = networkDefaultProps;

const WrappedNetwork = props => (
  <OptimizelyFeature feature="contactChunks">
    {isEnabled => <InnerNetwork {...props} contactChunks={isEnabled} />}
  </OptimizelyFeature>
);

export const Network = React.memo(WrappedNetwork);

export default function ContactsBox({ contacts, uid }) {
  if (!contacts) {
    return <p data-testid="loader">Loading...</p>;
  }
  return (
    <React.Fragment>
      {contacts.length ? (
        <ul className="list pl0 mt0 pb4">
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

function OldImport({
  visible,
  uid,
  selectedUser,
  setVisibility,
  setSelectedUser,
  dispatch,
  contacts,
  newDoc,
}) {
  return (
    <div className="pv4 flex justify-between" data-testid="outreachPage">
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
        <>
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
            className="btn2 b grow  ph3 pv2  pointer bn br1 white"
            data-testid="addPeopleButton"
          >
            Add New Person
          </button>
          <ImportContacts userId={uid} existingContacts={contacts} />
        </>
      )}
    </div>
  );
}

function NewImport({
  visible,
  uid,
  selectedUser,
  setVisibility,
  setSelectedUser,
  menu,
}) {
  return (
    <div className="pv4 flex " data-testid="outreachPage">
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
        <Dropdown overlay={menu} trigger={['click']}>
          <button
            type="button"
            className="btn2 b grow  ph3 pv2  pointer bn br1 white ant-dropdown-link"
            onClick={e => e.preventDefault()}
          >
            Add People
            <Icon type="plus" className="pl1" />
          </button>
        </Dropdown>
      )}
    </div>
  );
}
