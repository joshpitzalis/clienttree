import React from 'react';
import { Machine } from 'xstate';
// import { assert } from 'chai';
import { useMachine } from '@xstate/react';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import {
  _activateContact,
  _archiveContact,
  _trashContact,
} from '../contacts.api';

export const NewPeopleBox = ({ contacts, userId }) => {
  const Row = ({ index, style }) => (
    <Contact
      style={style}
      contact={contacts[index]}
      userId={userId}
      activateContact={_activateContact}
      archiveContact={_archiveContact}
      trashContact={_trashContact}
    />
  );

  return (
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeList
          className="center"
          height={height}
          itemCount={contacts && contacts.length}
          itemSize={80}
          width={width}
        >
          {/* // <main className="center"> */}
          {/* {contacts &&
      contacts.map(contact => (
        <Contact
          key={contact.uid}
          contact={contact}
          userId={userId}
          activateContact={_activateContact}
          archiveContact={_archiveContact}
          trashContact={_trashContact}
        />
      ))} */}
          {/* // </main> */}
          {Row}
        </FixedSizeList>
      )}
    </AutoSizer>
  );
};

export const contactMachine = Machine({
  id: 'contact',
  initial: 'archived',
  states: {
    archived: {
      on: {
        ALREADY_ACTIVATED: 'active',
        ACTIVATED: { target: 'active', actions: ['activateContact'] },
        TRASHED: { target: 'trashed', actions: ['trashContact'] },
      },
    },
    active: {
      on: {
        ARCHIVED: { target: 'archived', actions: ['archiveContact'] },
      },
    },
    trashed: {
      type: 'final',
    },
  },
});

export const Contact = ({
  contact,
  userId,
  activateContact,
  archiveContact,
  trashContact,
  style,
}) => {
  const [current, send] = useMachine(contactMachine, {
    actions: {
      activateContact,
      archiveContact,
      trashContact,
    },
  });

  const { uid, bucket, photoURL, name, handle } = contact;

  const checkifAlreadyActivated = React.useCallback((_bucket, _send) => {
    if (!_bucket || _bucket === 'active') {
      return _send('ALREADY_ACTIVATED');
    }
  }, []);

  React.useEffect(() => {
    checkifAlreadyActivated(bucket, send);
  }, [bucket, send, checkifAlreadyActivated]);
  if (current.matches('trashed')) {
    return null;
  }

  return (
    <article
      style={style}
      key={uid}
      className={`flex items-center justify-between w-100 bb b--black-05 pb2 mt2 ${!current.matches(
        'active'
      ) && 'o-50'}`}
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
          <div>
            <h1 className="f6 f5-ns fw6 lh-title black mv0 dib">{name}</h1>
            {current.matches('archived') && (
              <button
                className="bn pointer tr f5 ml3 dib"
                type="submit"
                data-testid="trashContact"
                onClick={() =>
                  send({ type: 'TRASHED', payload: { uid, userId } })
                }
              >
                🗑
              </button>
            )}
          </div>
          <h2 className="f6 fw4 mt0 mb0 black-60">{handle}</h2>
        </div>
      </div>
      <div className="w3 flex justify-end">
        <label
          htmlFor={name}
          className="lh-copy flex items-center justify-around  label relative  pointer "
          style={{ minWidth: '100%' }}
          data-testid="contactCheckbox"
        >
          <input
            className="taskBox"
            type="checkbox"
            id={name}
            data-testid={name}
            value={current.matches('active')}
            checked={current.matches('active')}
            onChange={() =>
              current.matches('active')
                ? send({ type: 'ARCHIVED', payload: { uid, userId } })
                : send({ type: 'ACTIVATED', payload: { uid, userId } })
            }
          />
          <span className="checkBox" data-state={current.matches('active')} />
        </label>
        {/* {current.matches('active') && (
            <button
              className="bn pointer tr f2"
              type="submit"
              data-testid="archiveContact"
              onClick={() =>
                send({ type: 'ARCHIVED', payload: { uid, userId } })
              }
            >
              ❌
            </button>
          )}
          {current.matches('archived') && (
            <button
              className="bn pointer tr f2"
              type="submit"
              data-testid="activateContact"
              onClick={() =>
                send({ type: 'ACTIVATED', payload: { uid, userId } })
              }
            >
              ✅
            </button>
          )} */}
      </div>
    </article>
  );
};
