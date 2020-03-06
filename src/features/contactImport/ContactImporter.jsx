import { useMachine } from '@xstate/react';
import { Dropdown, Icon, Menu } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { Machine } from 'xstate';
import Portal from '../../utils/Portal';
import { ConflictScreen } from './components/ConflictModal';
import { NewPeopleBox } from './components/ContactModal';
import {
  fetchContacts,
  handleContactsUpdate,
  mergeAllConflicts,
  updateContact,
} from './contacts.api';

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
            cond: 'checkifImported',
          },
          { target: 'loadingButton' },
        ],

        ALREADY_FETCHED: 'contactModal',
      },
    },
    loadingButton: {
      onEntry: ['handleImport'],
      on: {
        CONFLICTS_FOUND: 'conflictModal',
        NO_CONFLICTS_FOUND: 'contactModal',
      },
    },
    conflictModal: {
      on: {
        CLOSED: 'importButton',
        COMPLETED: 'contactModal',
        MERGE_ONE: {
          target: 'conflictModal',
          actions: ['updateContact'],
        },
        SKIP_ONE: 'conflictModal',
        SKIP_ALL: 'contactModal',
        MERGE_ALL: { target: 'contactModal', actions: ['mergeAllConflicts'] },
      },
    },
    contactModal: {
      on: {
        SAVED: { target: 'importButton', actions: ['handleSave'] },
        CLOSED: 'importButton',
        IMPORT_NEW: 'contactModal',
      },
      // onExit: ['updateContactCounts'],
    },
    errorMessage: {
      on: {
        RETRIED: 'loadingButton',
      },
    },
  },
});

export const ContactImporter = React.memo(({ uid, allContacts, children }) => {
  const activeContactss =
    allContacts &&
    allContacts.filter(item => !item.bucket || item.bucket === 'active').length;

  const archivedContacts =
    allContacts &&
    allContacts.filter(item => item.bucket === 'archived').length;

  const totalContacts = allContacts && allContacts.length;
  const [activeContacts, setActiveContacts] = React.useState(
    allContacts.filter(item => !item.bucket || item.bucket === 'active')
  );
  const [contactsToArchive, setContactsToArchive] = React.useState([]);
  const [conflicts, setConflicts] = React.useState([]);
  const [contactsToAdd, setContacts] = React.useState([]);
  const [contactsToDelete, deleteContact] = React.useState([]);

  const alreadyImported = useSelector(
    store => store.user && store.user.contactsImported
  );

  const [current, send] = useMachine(contactMachine, {
    actions: {
      handleImport: () => {
        const { gapi } = window;
        const googleAuth = gapi && gapi.auth2 && gapi.auth2.getAuthInstance();
        googleAuth
          .signIn()
          .then(() =>
            fetchContacts({
              _gapi: gapi,
              existingContacts: allContacts,
              userId: uid,
              send,
            })
          )
          .catch(error => console.log({ error }));
      },

      updateContact: (_, { payload }) => updateContact(uid, payload),
      mergeAllConflicts: () =>
        mergeAllConflicts({ conflicts, uid, _updateContact: updateContact }),
      handleSave: () =>
        handleContactsUpdate({
          contactsToAdd,
          contactsToDelete,
          contactsToArchive,
          uid,
          activeContacts: activeContactss,
          archivedContacts,
          totalContacts,
        }),
    },
    guards: {
      checkifImported: () => !!alreadyImported,
    },
  });

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
          <Icon type="google" className="pl1" />
          oogle Contacts
        </button>
      </Menu.Item>
    </Menu>
  );

  if (current.matches('importButton')) {
    return (
      <div className="mv4">
        <Dropdown overlay={menu} trigger={['click']}>
          <button
            type="button"
            className="btn2 green b  grow  ph3 pv2  pointer bn br1 white ant-dropdown-link"
            onClick={e => e.preventDefault()}
          >
            Add People
            <Icon type="plus" className="pl1" />
          </button>
        </Dropdown>
      </div>
    );
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
    );
  }

  if (current.matches('conflictModal')) {
    return (
      <div className="pv4 flex w-100" data-testid="outreachPage">
        {conflicts && !!conflicts.length && (
          <ConflictScreen
            send={send}
            duplicates={conflicts}
            existingContacts={allContacts}
            setDuplicates={setConflicts}
          ></ConflictScreen>
        )}
      </div>
    );
  }

  if (current.matches('contactModal')) {
    return (
      <Portal onClose={() => send('CLOSED')}>
        <ContactModal
          allContacts={allContacts}
          uid={uid}
          send={send}
          setContacts={setContacts}
          deleteContact={deleteContact}
          contactsToAdd={contactsToAdd}
          activeContacts={activeContacts}
          setActiveContacts={setActiveContacts}
          setContactsToArchive={setContactsToArchive}
          contactsToArchive={contactsToArchive}
        />
      </Portal>
    );
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
    );
  }

  return null;
});

const ContactModal = ({
  allContacts,
  uid,
  send,
  setContacts,
  deleteContact,
  contactsToAdd,
  activeContacts,
  setActiveContacts,
  setContactsToArchive,
}) => (
  <>
    <p className="f3 fw6 w-50 dib-l w-auto-l lh-title"> Select Contacts</p>
    <div className="overflow-y-auto vh-50">
      <NewPeopleBox
        userId={uid}
        setContacts={setContacts}
        deleteContact={deleteContact}
        contactsToAdd={contactsToAdd}
        setActiveContacts={setActiveContacts}
        activeContacts={activeContacts}
        setContactsToArchive={setContactsToArchive}
        contacts={
          allContacts &&
          allContacts.map(contact => {
            const {
              photoURL,
              name,
              bucket,
              occupation,
              organization,
              email,
              phoneNumber,
            } = contact;
            return {
              photoURL,
              name,
              handle:
                occupation ||
                (organization && organization.title) ||
                email ||
                phoneNumber,
              bucket,
              uid: contact.uid,
            };
          })
        }
      />
    </div>

    <button
      className="btn2 pa3 br2 b bn pointer"
      type="button"
      onClick={() => send('SAVED')}
    >
      {/* if total operations exceed 500 you must stop */}
      {contactsToAdd && contactsToAdd.length
        ? `Add ${contactsToAdd.length} ${
            contactsToAdd.length === 1 ? `Contact` : `Contacts`
          }`
        : `Done for Now`}
    </button>
  </>
);
