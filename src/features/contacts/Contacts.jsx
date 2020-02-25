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
import { setNewContact as set, updateContact } from './contacts.api.js';
import { ConflictScreen } from './components/ConflictScreen';

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
}) => {
  const [current, send] = useMachine(contactMachine, {
    actions: {
      // updateContact: (ctx, { payload }) => updateContact(userId, payload),
    },
  });

  if (current.matches('idle') || current.matches('loading')) {
    return (
      <button
        onClick={() => send('CLICKED')}
        type="button"
        className="btn3 b grow pv2  pointer bn br1 white"
        data-testid="addContacts"
      >
        {current.matches('loading') ? `Loading...` : `Organise Contacts`}
      </button>
    );
  }

  if (current.matches('selector')) {
    return (
      <Portal onClose={() => send('CLOSED')}>
        <div className="overflow-y-auto vh-75">
          <p className="f3 fw6 w-50 dib-l w-auto-l lh-title">{`${
            allContacts.filter(item => item.bucket === 'archived').length
          } Potential Contacts`}</p>
          {allContacts &&
            allContacts.map(
              ({ photoURL, name, bucket, occupation, organization }) => (
                <NewPeopleBox
                  contacts={[
                    {
                      photoURL,
                      name,
                      handle:
                        occupation || (organization && organization.title),
                      bucket,
                    },
                  ]}
                />
              )
            )}

          <p className="text3 i mb3">Done for now</p>
        </div>
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

function NewPeopleBox({ contacts }) {
  return (
    <main className=" center">
      {contacts &&
        contacts.map(({ photoURL, name, handle, bucket }) => (
          <article
            className={`flex items-center justify-between w-100 bb b--black-05 pb2 mt2 ${(!bucket ||
              bucket === 'active') &&
              'o-50'}`}
          >
            <div className="flex items-center ">
              <div className=" w2 w3-ns">
                <img
                  src={photoURL}
                  alt="pogo"
                  className="ba b--black-10 db br-100 w2 w3-ns h2 h3-ns"
                />
              </div>
              <div className="tl pl3">
                <h1 className="f6 f5-ns fw6 lh-title black mv0 ">{name}</h1>
                <h2 className="f6 fw4 mt0 mb0 black-60">{handle}</h2>
              </div>
            </div>
            <div className="w4">
              <form className="w-100 tr  flex justify-center">
                {!bucket || bucket === 'active' ? (
                  <button className="bn pointer tr f2" type="submit">
                    ❌
                  </button>
                ) : (
                  <button className="bn pointer tr f2" type="submit">
                    ✅
                  </button>
                )}
              </form>
            </div>
          </article>
        ))}
    </main>
  );
}

// {/* <span></span> */}
// <span>😁</span>
// <span className="h3 w-auto">🤔</span>
// {/* <span>🗑</span> */}
// <span>💩</span>
// {/* <span>Who dis❓</span> */}
// <span>🧐</span>
