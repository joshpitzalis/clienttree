import React from 'react'
import PropTypes from 'prop-types'
import './networkAnimations.css'
import { useSelector } from 'react-redux'
import { OptimizelyFeature } from '@optimizely/react-sdk'
import { Person } from './components/Person'
import { PersonModal } from './components/PersonBox'
import ErrorBoundary from '../../utils/ErrorBoundary'
import { InsightsBox } from '../insights/InsightsBox'
import { HelpfulTaskList } from './components/UniversalTaskList'
import { ContactImporter } from '../googleImport'
import {
  useRecoilState
} from 'recoil'
import { reminderModalState } from '../../pages/Dashboard'

const networkPropTypes = {
  uid: PropTypes.string.isRequired
}

const networkDefaultProps = {}

/* eslint-disable react/prop-types */
export const InnerNetwork = ({ uid, contactChunks }) => {
  const [visible, setVisibility] = useRecoilState(reminderModalState)
  const [selectedUser, setSelectedUser] = React.useState('')

  const allContacts = useSelector(
    store =>
      store &&
      store.contacts &&
      store.contacts.filter(contact => contact && contact.uid))

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

  return (
    <ErrorBoundary fallback="Oh no! This bit is broken 🤕">
      <div data-testid="outreachPage">

        <OptimizelyFeature feature="insights">
          {insights => insights &&
         <InsightsBox />}
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
              onClick={() => setVisibility(true)}
              className="btn3 b grow black tl pv2  pointer bn br1 white"
              data-testid="addPeopleButton"
            >
              Add Someone New
            </button>
          </ContactImporter>
        )}
        <ActiveContactList contacts={allContacts} uid={uid} />
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
