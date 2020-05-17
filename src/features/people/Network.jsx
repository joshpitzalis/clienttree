import React from 'react'
import PropTypes from 'prop-types'
import './networkAnimations.css'
import { useSelector, useDispatch } from 'react-redux'
import { OptimizelyFeature } from '@optimizely/react-sdk'
import { Menu, Dropdown, Icon } from 'antd'
import ImportContacts from '../contacts/Contacts'
import { Person } from './components/Person'
import { PersonModal } from './components/PersonBox'
import ErrorBoundary from '../../utils/ErrorBoundary'
import firebase from '../../utils/firebase'
import { InsightsBox } from '../insights/InsightsBox'
import { HelpfulTaskList } from './components/UniversalTaskList'
import GoogleImport from '../contacts/components/GoogleImport'
import { ConflictScreen } from '../contacts/components/ConflictScreen'
import { updateContact } from '../contacts/contacts.api.js'
import { ContactImporter } from '../contactImport/ContactImporter'

import { sortContacts } from './peopleHelpers/network.helpers'

const networkPropTypes = {
  uid: PropTypes.string.isRequired
}
const networkDefaultProps = {}

/* eslint-disable react/prop-types */
export const InnerNetwork = ({ uid, contactChunks }) => {
  const [conflicts, setConflicts] = React.useState([])
  const [contactPicker, setContactPicker] = React.useState(false)
  const [visible, setVisibility] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState('')

  const contacts = useSelector(
    store => store && store.contacts && sortContacts(store.contacts)
  )

  const allContacts = useSelector(
    store =>
      store &&
      store.contacts &&
      store.contacts.filter(contact => contact && contact.uid)
  )

  // sortContacts(store.contacts.filter(contact => contact && contact.uid))

  const dispatch = useDispatch()
  const newDoc = firebase
    .firestore()
    .collection('users')
    .doc(uid)
    .collection('contacts')
    .doc()

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

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <button
          type="button"
          onClick={() => {
            setSelectedUser(newDoc.id)
            dispatch({
              type: 'people/setSelectedUser',
              payload: newDoc.id
            })
            setVisibility(true)
          }}
          className="btn3 b grow  tl pv2  pointer bn br1 white"
          data-testid="addPeopleButton"
        >
          Add Someone New
        </button>
      </Menu.Item>
      <Menu.Item key="1">
        <GoogleImport
          userId={uid}
          existingContacts={allContacts}
          setConflicts={setConflicts}
          setContactPicker={setContactPicker}
        >
          <ImportContacts userId={uid} existingContacts={contacts} />
        </GoogleImport>
      </Menu.Item>

    </Menu>
  )

  const dispatcher = _value => {
    if (_value === 'CLOSED') {
      setConflicts([])
    }

    if (_value === 'COMPLETED') {
      setConflicts([])
      setContactPicker(true)
    }

    if (_value.type === 'DUPLICATE_SELECTED') {
      const { payload } = _value

      updateContact(uid, payload)
    }

    if (_value.type === 'EXISTING_SELECTED') {
      return null
    }

    return null
  }

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
              setVisibility(false)
              setSelectedUser('')
            }}
            newPerson
          />
        ) : (
          <ContactImporter uid={uid} allContacts={allContacts}>
            <button
              type="button"
              onClick={() => {
                setSelectedUser(newDoc.id)
                dispatch({
                  type: 'people/setSelectedUser',
                  payload: newDoc.id
                })
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
      </>
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
    return <p data-testid='loader'>Loading...</p>
  }
  return (
    <>
      {contacts.length ? (
        <ul className='list pl0 mt0'>
          {contacts && contacts.map(
            contact =>
              contact.uid && (
                <Person key={contact.uid} contact={contact} uid={uid} />
              )
          )}
        </ul>
      ) : (
        <p data-testid='emptyContacts'>No Contacts Yet.</p>
      )}
    </>
  )
}

/* eslint-disable react/prop-types */

export default function ContactsBox ({ contacts, uid }) {
  return (
    <ErrorBoundary fallback='Oh no! This bit is broken 🤕'>
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
            <article className='text2'>
              <InsightsBox />
              {/* <h1 className="text2">This Week</h1>
                <UniversalTaskList myUid={uid} insights={insights} /> */}
            </article>
          )}
      </OptimizelyFeature>
      <>
        {contactPicker && (<>
          {/* <PickContacts
            userId={uid}
            allContacts={allContacts}
            alreadyImported
            count={
              allContacts &&
                allContacts.filter(item => item.bucket === 'archived').length
            }
          /> */}
        </>)}</>

      <OptimizelyFeature feature="workboard">
        {workboard =>
          !workboard && <HelpfulTaskList myUid={uid} insights={workboard} />
        }
      </OptimizelyFeature>
      <NewImport
        visible={visible}
        uid={uid}
        selectedUser={selectedUser}
        setVisibility={setVisibility}
        setSelectedUser={setSelectedUser}
        menu={menu}
      />
      <ContactsBox contacts={contacts} uid={uid} />
    </ErrorBoundary>
  )
}

  function NewImport ({
    visible,
    uid,
    selectedUser,
    setVisibility,
    setSelectedUser,
    menu
  }) {
    return (
      <div className="pv4 flex " data-testid="outreachPage">
        {visible ? (
          <PersonModal
            uid={uid}
            contactId={selectedUser}
            onClose={() => {
              setVisibility(false)
              setSelectedUser('')
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
    )
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
};
