// import GoogleContacts from 'react-google-contacts';
// import Avatar from 'react-avatar';

import React, { useState } from 'react';
import { assert } from 'chai';
import { useMachine } from '@xstate/react';
import { Machine } from 'xstate';
import { _handleImport, useCloudsponge } from './contacts.helpers.js';
import { ConflictScreen } from './components/ConflictScreen';

// const responseCallback = response => {
//   console.log(response);
// };

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
