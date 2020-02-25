import React from 'react';
import PropTypes from 'prop-types';
import './networkAnimations.css';
import { useSelector, useDispatch } from 'react-redux';
import { OptimizelyFeature } from '@optimizely/react-sdk';
import { Menu, Dropdown, Icon } from 'antd';
import { Person } from './components/Person';
import { PersonModal } from './components/PersonBox';
import ErrorBoundary from '../../utils/ErrorBoundary';
import firebase from '../../utils/firebase';
import ImportContacts, { PickContacts } from '../contacts/Contacts';
import { InsightsBox } from '../insights/InsightsBox';
import { HelpfulTaskList } from './components/UniversalTaskList';
import GoogleImport from '../contacts/components/GoogleImport';

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
  const [visible, setVisibility] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState('');
  const contacts = useSelector(store => store && sortContacts(store.contacts));
  const allContacts = useSelector(store => store && store.contacts);
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
        <PickContacts userId={uid} allContacts={allContacts} />
      </Menu.Item>
      <Menu.Divider />
      <GoogleImport userId={uid}>
        <ImportContacts userId={uid} existingContacts={contacts} />
      </GoogleImport>
    </Menu>
  );

  return (
    <ErrorBoundary fallback="Oh no! This bit is broken 🤕">
      <>
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
    <div className="pv4 flex justify-center" data-testid="outreachPage">
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
