import React from 'react'
import PropTypes from 'prop-types'
import './networkAnimations.css'
import { useSelector } from 'react-redux'
import { OptimizelyFeature } from '@optimizely/react-sdk'
import { Person } from './components/Person'
import { PersonModal } from './components/PersonBox'
import ErrorBoundary from '../../utils/ErrorBoundary'
// import firebase from '../../utils/firebase'
import { InsightsBox } from '../insights/InsightsBox'
import { HelpfulTaskList } from './components/UniversalTaskList'
// import { ConflictScreen } from '../contacts/components/ConflictScreen'
// import { updateContact } from '../contacts/contacts.api.js'
import { ContactImporter } from '../contactImport/ContactImporter'
// import { sortContacts } from './peopleHelpers/network.helpers'

const networkPropTypes = {
  uid: PropTypes.string.isRequired
}
const networkDefaultProps = {}

/* eslint-disable react/prop-types */
export const InnerNetwork = ({ uid, contactChunks }) => {
  // const [conflicts, setConflicts] = React.useState([])
  // const [, setContactPicker] = React.useState(false)
  const [visible, setVisibility] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState('')

  const allContacts = useSelector(
    store =>
      store &&
      store.contacts &&
      store.contacts.filter(contact => contact && contact.uid))

  // sortContacts(store.contacts.filter(contact => contact && contact.uid))

  // const dispatch = useDispatch()
  // const newDoc = firebase
  //   .firestore()
  //   .collection('users')
  //   .doc(uid)
  //   .collection('contacts')
  //   .doc()

  React.useEffect(() => {
    const { gapi } = window
    gapi.load('client', () =>
      gapi.client.init({
        apiKey: process.env.REACT_APP_API_KEY,
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        discoveryDocs: [
          'https://www.googleapis.com/discovery/v1/apis/people/v1/rest'
        ],
        scope: 'https://www.googleapis.com/auth/contacts.readonly'
      })
    )
  }, [])

  // const dispatcher = _value => {
  //   if (_value === 'CLOSED') {
  //     setConflicts([])
  //   }

  //   if (_value === 'COMPLETED') {
  //     setConflicts([])
  //     setContactPicker(true)
  //   }

  //   if (_value.type === 'DUPLICATE_SELECTED') {
  //     const { payload } = _value

  //     updateContact(uid, payload)
  //   }

  //   if (_value.type === 'EXISTING_SELECTED') {
  //     return null
  //   }

  //   return null
  // }

  return (
    <ErrorBoundary fallback="Oh no! This bit is broken 🤕">
      <div data-testid="outreachPage">
        {/* {conflicts && !!conflicts.length && (
          <ConflictScreen
            send={dispatcher}
            duplicates={conflicts}
            existingContacts={allContacts}
            setDuplicates={setConflicts}
          ></ConflictScreen>
        )} */}

        <OptimizelyFeature feature="insights">
          {insights => insights && <InsightsBox />}
        </OptimizelyFeature>

        <OptimizelyFeature feature="workboard">
          {workboard =>
            !workboard && <HelpfulTaskList myUid={uid} insights={workboard} />
          }
        </OptimizelyFeature>

        {visible ? (
          <PersonModal
            uid={uid}
            contactId={selectedUser}
            onClose={() => {
              setVisibility(false)
              setSelectedUser('')
            }}
            newPerson

            setVisibility={() =>
              setVisibility(false)}
          />
        ) : (
          <ContactImporter uid={uid} allContacts={allContacts}>
            <button
              type="button"
              onClick={() => {
                // setSelectedUser(newDoc.id)
                // dispatch({
                //   type: 'people/setSelectedUser',
                //   payload: newDoc.id
                // })
                setVisibility(true)
              }}
              className="btn3 b grow black tl pv2  pointer bn br1 white"
              data-testid="addPeopleButton"
            >
              Add Someone New
            </button>
          </ContactImporter>
        )}
        <ActiveContactList contacts={allContacts} uid={uid} />
        {/* <ContactsBox contacts={contacts} uid={uid} /> */}

      </div>
    </ErrorBoundary>
  )
}

InnerNetwork.propTypes = networkPropTypes
InnerNetwork.defaultProps = networkDefaultProps

const WrappedNetwork = props => (
  <OptimizelyFeature feature='contactsSync'>
    {isEnabled => <InnerNetwork {...props} bulkImportFeature={isEnabled} />}
  </OptimizelyFeature>
)

export const Network = React.memo(WrappedNetwork)

const ActiveContactList = ({ contacts, uid }) => {
  if (!contacts) {
    return <p data-testid="loader">Loading...</p>
  }

  if (contacts.length) {
    return (
      <ul className="list pl0 mt0 pb4">
        {contacts.map(contact => (
          <Person key={contact.uid} contact={contact} uid={uid} />
        ))}
      </ul>
    )
  }

  return <p data-testid="emptyContacts">No Contacts Yet.</p>
}
