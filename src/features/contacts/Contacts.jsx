// import Avatar from 'react-avatar';
import { Icon } from 'antd';
import React, { useState } from 'react';
import { assert } from 'chai';
import { useMachine } from '@xstate/react';
import { Machine } from 'xstate';
import Portal from '../../utils/Portal';
import {
  parseContacts,
  handleContactSync,
  handleAddition as add,
  handleError as error,
  handleSuccessfulCompletion as success,
  handlePending as pending,
} from './contacts.helpers.js';
import { contactMachine } from './contacts.statechart';
import {
  setNewContact as set,
  updateContact,
  updateContactCount,
} from './contacts.api.js';
import { ConflictScreen } from './components/ConflictScreen';
import { NewPeopleBox } from './components/NewPeopleBox';

export const useCloudsponge = ({
  userId,
  existingContacts,
  send,
  setDuplicates,
}) => {
  const { cloudsponge } = window;

  const processContacts = React.useCallback(
    async contacts => {
      const newContacts = parseContacts(contacts);
      await handleContactSync({
        userId,
        existingContacts,
        newContacts,
        setDuplicates,
        add,
        set,
        error,
        success,
        pending,
      });
      send('CONTACTS_SELECTED');
    },
    [existingContacts, send, setDuplicates, userId]
  );

  const closeModal = React.useCallback(() => send('CANCELLED'), [send]);

  React.useEffect(() => {
    if (cloudsponge) {
      return cloudsponge.init({
        afterSubmitContacts: processContacts,
        afterClosing: closeModal,
        include: ['photo'],
        localeData: {
          AUTHORIZATION: 'Loading...',
          AUTHORIZATION_FOCUS:
            'This will take a few minutes, roughly one minute for every 700 contacts we crunch.',
        },
        displaySelectAllNone: false,
        css: `${
          process.env.NODE_ENV === 'production'
            ? process.env.REACT_APP_URL
            : 'http://localhost:3000'
        }/cloudsponge.css`,
      });
    }
  }, [cloudsponge, processContacts, closeModal]);
};

export const _handleImport = () => {
  const { cloudsponge } = window;
  cloudsponge.launch('gmail');
};

const test = state => ({ getByTestId }) => {
  assert.ok(getByTestId(state));
};

export const mergeMachine = Machine({
  id: 'merge',
  initial: 'addButton',
  states: {
    addButton: {
      on: {
        CLICKED: {
          target: 'selectionScreen',
          actions: ['handleImport'],
        },
      },
      meta: {
        test: test('importContacts'),
      },
    },
    selectionScreen: {
      on: {
        CONTACTS_SELECTED: 'conflictScreen',
        CANCELLED: 'conflictScreen',
      },
    },
    conflictScreen: {
      on: {
        COMPLETED: 'addButton',

        CLOSED: 'addButton',
        DUPLICATE_SELECTED: {
          target: 'conflictScreen',
          actions: ['updateContact'],
        },
        EXISTING_SELECTED: 'conflictScreen',
      },
      meta: {
        test: test('conflictScreen'),
      },
    },
  },
});

const ImportContacts = ({
  handleImport = _handleImport,
  userId,
  existingContacts,
}) => {
  const [current, send] = useMachine(mergeMachine, {
    actions: {
      handleImport: () => handleImport(),
      updateContact: (ctx, { payload }) => updateContact(userId, payload),
    },
  });

  const [duplicates, setDuplicates] = useState([]);

  useCloudsponge({ userId, existingContacts, send, setDuplicates });

  if (current.matches('addButton')) {
    return (
      <button
        onClick={() => send('CLICKED')}
        type="button"
        className="btn3 b grow  mh3 tl pv2  pointer bn br1 white"
        data-testid="importContacts"
      >
        Import from
        <Icon type="google" className="pl2" />
      </button>
    );
  }

  if (current.matches('conflictScreen')) {
    return (
      <ConflictScreen
        send={send}
        duplicates={duplicates}
        setDuplicates={setDuplicates}
        existingContacts={existingContacts}
      />
    );
  }

  return null;
};

export default ImportContacts;

export const PickContacts = ({
  handleImport = _handleImport,
  userId,
  allContacts,
  alreadyImported,
  count,
}) => {
  const activeContacts =
    allContacts &&
    allContacts.filter(item => !item.bucket || item.bucket === 'active').length;

  const archivedContacts =
    allContacts &&
    allContacts.filter(item => item.bucket === 'archived').length;

  const totalContacts = allContacts && allContacts.length;

  const [current, send] = useMachine(contactMachine, {
    actions: {
      updateContactCounts: () =>
        updateContactCount(userId, {
          activeContacts,
          archivedContacts,
          totalContacts,
        }),
    },
  });

  React.useEffect(() => {
    console.log({ alreadyImported });

    if (alreadyImported) {
      send('ALREADY_FETCHED');
    }
  }, [alreadyImported, send]);

  // if (current.matches('idle') || current.matches('loading')) {
  //   return (
  //     <button
  //       onClick={() => send('CLICKED')}
  //       type="button"
  //       className="btn3 b grow pv2  pointer bn br1 white"
  //       data-testid="addContacts"
  //     >
  //       {current.matches('loading') ? `Loading...` : `Organise Contacts`}
  //     </button>
  //   );
  // }

  if (current.matches('selector')) {
    return (
      <Portal onClose={() => send('CLOSED')}>
        <p className="f3 fw6 w-50 dib-l w-auto-l lh-title">{`${count} Potential Contacts`}</p>
        <div className="overflow-y-auto vh-75">
          <NewPeopleBox
            userId={userId}
            contacts={
              allContacts &&
              allContacts.map(
                ({
                  photoURL,
                  name,
                  bucket,
                  occupation,
                  organization,
                  uid,
                  email,
                  phoneNumber,
                }) => ({
                  photoURL,
                  name,
                  handle:
                    occupation ||
                    (organization && organization.title) ||
                    email ||
                    phoneNumber,
                  bucket,
                  uid,
                })
              )
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
        {/* <div className="flex justify-between">
          <p className="text3 i mb3">Show More...</p>
          <button className="text3 i bn pointer mb3">DONE FOR NOW</button>
        </div> */}
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
};
