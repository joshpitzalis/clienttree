import { useMachine } from '@xstate/react';
import { Dropdown, Icon, Menu } from 'antd';
import React from 'react';
import { Machine } from 'xstate';
import Portal from '../../utils/Portal';
import { ConflictScreen } from './components/ConflictScreen';
import { NewPeopleBox } from './components/NewPeopleBox';
import {
  fetchContacts,
  updateContact,
  updateContactCount,
} from './contacts.api';

// https://xstate.js.org/viz/?gist=8d51d699c694c3ee9ab2804ceaedf702

const contactMachine = Machine({
  id: 'contacts',
  initial: 'importButton',
  states: {
    importButton: {
      on: {
        IMPORT: 'loadingButton',
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
        DUPLICATE_SELECTED: {
          target: 'conflictModal',
          actions: ['updateContact'],
        },
        EXISTING_SELECTED: 'conflictModal',
        SKIP_ALL: 'contactModal',
        MERGE_ALL: 'contactModal',
      },
    },
    contactModal: {
      on: {
        CONFLICTS_FOUND: 'conflictModal',
        REVEALED_MORE: 'contactModal',
        CLOSED: { target: 'importButton', actions: ['updateContactCounts'] },
      },
    },
    errorMessage: {
      on: {
        RETRIED: 'loadingButton',
      },
    },
  },
});

export const ContactAdder = React.memo(
  ({ uid, allContacts, children, alreadyImported }) => {
    const activeContacts =
      allContacts &&
      allContacts.filter(item => !item.bucket || item.bucket === 'active')
        .length;

    const archivedContacts =
      allContacts &&
      allContacts.filter(item => item.bucket === 'archived').length;

    const totalContacts = allContacts && allContacts.length;

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
        updateContactCounts: () =>
          updateContactCount(uid, {
            activeContacts,
            archivedContacts,
            totalContacts,
          }),
        updateContact: (ctx, { payload }) => updateContact(uid, payload),
      },
    });

    const [conflicts, setConflicts] = React.useState([]);

    // React.useEffect(() => {
    //   if (alreadyImported) {
    //     send('ALREADY_FETCHED');
    //   }
    // }, [alreadyImported, send, conflicts]);

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
              // send={dispatcher}
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
          <p className="f3 fw6 w-50 dib-l w-auto-l lh-title">{`${allContacts &&
            allContacts.filter(item => item.bucket === 'archived')
              .length} Potential Contacts`}</p>
          <div className="overflow-y-auto vh-75">
            <NewPeopleBox
              userId={uid}
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
            onClick={() => send('CLOSED')}
          >
            Done for now
          </button>
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
  }
);
