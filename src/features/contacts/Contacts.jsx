// import GoogleContacts from 'react-google-contacts';
// import Avatar from 'react-avatar';

import React, { useState } from 'react';
import { assert } from 'chai';
import { useMachine } from '@xstate/react';
import { Machine } from 'xstate';
import {
  parseContacts,
  handleContactSync,
  handleAddition as add,
  handleError as error,
  handleSuccessfulCompletion as success,
  handlePending as pending,
} from './contacts.helpers.js';

import { setNewContact as set } from './contacts.api.js';

import { ConflictScreen } from './components/ConflictScreen';

// const responseCallback = response => {
//   console.log(response);
// };

export const useCloudsponge = ({
  userId,
  existingContacts,
  send,
  setDuplicates,
}) => {
  const { cloudsponge } = window;

  const processContacts = React.useCallback(
    contacts => {
      send('CONTACTS_SELECTED');
      const newContacts = parseContacts(contacts);
      handleContactSync({
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
    },
    [existingContacts, send, setDuplicates, userId]
  );

  const closeModal = React.useCallback(() => {
    cloudsponge.end();
  }, [cloudsponge]);

  React.useEffect(() => {
    if (cloudsponge) {
      return cloudsponge.init({
        afterSubmitContacts: processContacts,
        afterClosing: closeModal,
        include: ['photo'],
        localeData: {
          AUTHORIZATION: 'Loading...',
          AUTHORIZATION_FOCUS:
            'This will take a few minutes, roughly a minute for every 700 contacts we have to crunch, we are working on speeding things up.',
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
      },
    },
    conflictScreen: {
      on: {
        COMPLETED: 'addButton',
        CLOSED: 'addButton',
        DUPLICATE_SELECTED: 'conflictScreen',
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
    },
  });

  const [duplicates, setDuplicates] = useState([]);

  useCloudsponge({ userId, existingContacts, send, setDuplicates });

  if (current.matches('addButton')) {
    return (
      <button
        onClick={() => send('CLICKED')}
        type="button"
        className="btn3 b grow  ph3 pv2  pointer bn br1 white"
        data-testid="importContacts"
      >
        Import Contacts
      </button>
    );
  }

  if (current.matches('conflictScreen')) {
    return (
      <ConflictScreen
        send={send}
        duplicates={duplicates}
        existingContacts={existingContacts}
      />
    );
  }

  return null;
};

export default ImportContacts;
