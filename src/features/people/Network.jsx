import React from 'react';
import PropTypes from 'prop-types';
import './networkAnimations.css';
import { useSelector, useDispatch } from 'react-redux';
import { OptimizelyFeature } from '@optimizely/react-sdk';
import { Person } from './components/Person';
import { PersonModal } from './components/PersonBox';
import ErrorBoundary from '../../utils/ErrorBoundary';
import firebase from '../../utils/firebase';
import ImportContacts from '../contacts/Contacts';
import { InsightsBox } from '../insights/InsightsBox';
// import { HelpfulTaskList as UniversalTaskList } from './components/UniversalTaskList';

const networkPropTypes = {
  uid: PropTypes.string.isRequired,
};
const networkDefaultProps = {};

export const InnerNetwork = ({ uid, bulkImportFeature }) => {
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
                Add Someone New
              </button>
              {bulkImportFeature && (
                <ImportContacts userId={uid} existingContacts={contacts} />
              )}
            </>
          )}
        </div>

        <ContactsBox contacts={contacts} uid={uid}></ContactsBox>
      </>
    </ErrorBoundary>
  );
};
InnerNetwork.propTypes = networkPropTypes;
InnerNetwork.defaultProps = networkDefaultProps;

const WrappedNetwork = props => (
  <OptimizelyFeature feature="contactsSync">
    {isEnabled => <InnerNetwork {...props} bulkImportFeature={isEnabled} />}
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
