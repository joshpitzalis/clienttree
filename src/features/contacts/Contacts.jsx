import { useMachine } from '@xstate/react';
import { Dropdown, Icon, Menu } from 'antd';
import React from 'react';
import { Machine } from 'xstate';
import Portal from '../../utils/Portal';
import { ConflictScreen } from './components/ConflictScreen';
import GoogleImport from './components/GoogleImport';
import { NewPeopleBox } from './components/NewPeopleBox';
import { updateContact, updateContactCount } from './contacts.api.js';

const contactMachine = Machine({
  id: 'contacts',
  initial: 'idle',
  states: {
    idle: {
      on: {
        CLICKED: 'loading',
        ALREADY_FETCHED: 'selector',
      },
    },
    // loading: {
    //   invoke: {
    //     id: 'getPermissions',
    //     src: fetchContacts,
    //     onDone: {
    //       target: 'selector',
    //       // actions: assign({ user: (context, event) => event.data }),
    //     },
    //     onError: {
    //       target: 'error',
    //       // actions: assign({ error: (context, event) => event.data }),
    //     },
    //   },
    // },
    loading: {
      after: {
        1000: { target: 'selector' },
      },
    },

    selector: {
      onEntry: ['deduplicate', 'preSelect', 'enrich'],
      on: {
        REVEALED_MORE: 'selector',
        CLOSED: { target: 'idle', actions: ['updateContactCounts'] },
      },
    },
    error: {
      on: {
        RETRIED: 'loading',
      },
    },
  },
});

export const ContactAdder = ({ uid, allContacts, children }) => {
  const [conflicts, setConflicts] = React.useState([]);
  const [contactPicker, setContactPicker] = React.useState(false);

  const dispatcher = _value => {
    if (_value === 'CLOSED') {
      setConflicts([]);
    }
    if (_value === 'COMPLETED') {
      setConflicts([]);
      setContactPicker(true);
    }
    if (_value.type === 'DUPLICATE_SELECTED') {
      const { payload } = _value;
      updateContact(uid, payload);
    }
    if (_value.type === 'EXISTING_SELECTED') {
      return null;
    }
    return null;
  };

  const menu = (
    <Menu>
      <Menu.Item key="0">{children}</Menu.Item>
      <Menu.Item key="1">
        <GoogleImport
          userId={uid}
          existingContacts={allContacts}
          setConflicts={setConflicts}
          setContactPicker={setContactPicker}
        />
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="pv4 flex w-100" data-testid="outreachPage">
      {conflicts && !!conflicts.length && (
        <ConflictScreen
          send={dispatcher}
          duplicates={conflicts}
          existingContacts={allContacts}
          setDuplicates={setConflicts}
        ></ConflictScreen>
      )}

      {contactPicker && (
        <PickContacts
          userId={uid}
          allContacts={allContacts}
          alreadyImported
          count={
            allContacts &&
            allContacts.filter(item => item.bucket === 'archived').length
          }
        />
      )}

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
};

export const PickContacts = ({
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
