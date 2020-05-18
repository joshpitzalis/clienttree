import { useMachine } from '@xstate/react'
import { Dropdown, Icon, Menu } from 'antd'
import React from 'react'
import { useSelector } from 'react-redux'
import { Machine } from 'xstate'
import Portal from '../../utils/Portal'
import { useRecoilState, atom } from 'recoil'
import { fetchContacts, saveImportedContacts } from './helpers'
import { ContactModal } from './ContactModal'

const contactState = atom({
  key: 'contactState',
  default: []
})

const newContacts = atom({
  key: 'newContacts',
  default: []
})

// https://xstate.js.org/viz/?gist=8d51d699c694c3ee9ab2804ceaedf702
const contactMachine = Machine({
  id: 'contacts',
  initial: 'importButton',
  states: {
    importButton: {
      on: {
        IMPORT: [
          {
            target: 'contactModal',
            cond: 'checkifImported'
          },
          { target: 'loadingButton' }
        ],
        ALREADY_FETCHED: 'contactModal'
      }
    },
    loadingButton: {
      onEntry: ['handleImport'],
      on: {
        CONFLICTS_FOUND: 'conflictModal',
        NO_CONFLICTS_FOUND: 'contactModal'
      }
    },
    conflictModal: {
      on: {
        CLOSED: 'importButton',
        COMPLETED: 'contactModal'
      }
    },
    contactModal: {
      on: {
        SAVED: { target: 'importButton', actions: ['handleSave', 'clear'] },
        CLOSED: { target: 'importButton', actions: ['clear'] }
      }
    },
    errorMessage: {
      on: {
        RETRIED: 'loadingButton'
      }
    }
  }
})

/* eslint-disable react/prop-types */
export const ContactImporter = React.memo(({ uid, allContacts, children }) => {
  const alreadyImported = useSelector(
    store => store.user && store.user.contactsImported
  )

  const [contacts, setPotentialContacts] = useRecoilState(contactState)
  const [newContactList, setNewContactList] = useRecoilState(newContacts)
  const [contactsToArchive, setContactsToArchive] = React.useState([])
  const [contactsToAdd, setContacts] = React.useState([])

  const [current, send] = useMachine(contactMachine, {
    actions: {
      handleImport: () => {
        const { gapi } = window
        const googleAuth = gapi && gapi.auth2 && gapi.auth2.getAuthInstance()
        googleAuth
          .signIn()
          .then(() =>
            fetchContacts({
              _gapi: gapi,
              existingContacts: allContacts,
              userId: uid,
              send,
              setContacts: setPotentialContacts
            })
          )
          .catch(error => console.log({ error }))
      },
      handleSave: () => saveImportedContacts(newContactList, uid),
      clear: () => {
        setPotentialContacts([])
        setNewContactList([])
      }

    },
    guards: {
      checkifImported: () => !!alreadyImported
    }
  })

  const menu = (
    <Menu>
      <Menu.Item key="0">{children}</Menu.Item>
      <Menu.Item key="1">
        <button
          onClick={() => send('IMPORT')}
          type="button"
          className="btn3 b black grow mr2  tl pv2  pointer bn br1 white"
          data-testid="importContacts"
        >
          Import
          <Icon type="google" className="pl1 mb-2" />
          oogle Contacts
        </button>
      </Menu.Item>
    </Menu>
  )

  if (current.matches('importButton')) {
    return (
      <div className="mv4">
        <Dropdown overlay={menu} trigger={['click']}>
          <button
            type="button"
            className="btn2 green b  grow  ph3 pv2  pointer bn br1 white ant-dropdown-link"
            onClick={e => e.preventDefault()}
            data-testid='addPeopleButton'
          >
            Add People
          </button>
        </Dropdown>
      </div>
    )
  }

  if (current.matches('loadingButton')) {
    return (
      <div className="mv4">
        <button
          type="button"
          className="btn2 green b  grow  ph3 pv2  pointer bn br1 white ant-dropdown-link"
          onClick={() => {}}
        >
          Importing...
        </button>
      </div>
    )
  }

  if (current.matches('contactModal')) {
    return (
      <Portal onClose={() => send('CLOSED')}>
        <ContactModal
          allContacts={contacts}
          uid={uid}
          send={send}
          setContacts={setContacts}
          contactsToAdd={contactsToAdd}
          setContactsToArchive={setContactsToArchive}
          contactsToArchive={contactsToArchive}
          setNewContactList={setNewContactList}
          newContactList={newContactList}
        />
      </Portal>
    )
  }

  if (current.matches('error')) {
    return (
      <button
        onClick={() => send('CLICKED')}
        type="button"
        className="btn3 b grow  ph3 pv2  pointer bn br1 white"
        data-testid="addContacts"
      >
        Error
      </button>
    )
  }

  return null
})
