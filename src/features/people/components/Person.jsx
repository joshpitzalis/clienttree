import React from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import fromUnixTime from 'date-fns/fromUnixTime';
import { useMachine } from '@xstate/react';
import { Machine } from 'xstate';
import { useDispatch } from 'react-redux';
import { PersonModal } from './PersonBox';

const peopleMachine = Machine({
  id: 'people',
  initial: 'closed',
  states: {
    closed: {
      on: {
        OPENED: { target: 'opened', actions: ['setSelectedUser'] },
      },
    },
    opened: {
      on: {
        CLOSED: { target: 'closed', actions: ['clearSelectedUser'] },
      },
    },
  },
});

/**
 * @param {Date} timestamp
 */
const isValidDate = timestamp => new Date(timestamp).getTime() > 0;

/**
 * @param {{ 
 * uid: string,
 * contact: {
      uid: String,
      lastContacted: Number,
      activeTaskCount: Number,
      name: String,
      photoURL: String,
    }
  }} [Props] There used to be more parameters thats why it is still shaped as an object
*/
export const Person = ({ contact, uid }) => {
  const dispatch = useDispatch();

  const [current, send] = useMachine(peopleMachine, {
    actions: {
      setSelectedUser: (ctx, event) =>
        dispatch({ type: 'people/setSelectedUser', payload: event.payload }),
      clearSelectedUser: () => dispatch({ type: 'people/clearSelectedUser' }),
    },
  });

  switch (current.value) {
    case 'closed':
      return (
        <li key={contact.uid} className="mb3" data-testid="closedPeopleBox">
          <div
            className="flex items-center lh-copy pa3 ph0-l bb b--black-10 pointer bg-white"
            onClick={() => {
              send({ type: 'OPENED', payload: contact.uid });
            }}
            tabIndex={-1}
            onKeyPress={() => send({ type: 'OPENED', payload: contact.uid })}
            role="button"
            data-testid="openBox"
          >
            <img
              alt={`${contact.name} avatar`}
              className="w2 h2 w3-ns h3-ns br-100"
              src={contact.photoURL}
            />
            <div className="pl3 flex-auto">
              <span className="f6 db black-70 b">{contact.name}</span>
              <span className="f6 db black-70 i">
                {contact.lastContacted &&
                isValidDate(fromUnixTime(contact.lastContacted))
                  ? `Last contacted ${formatDistanceToNow(
                      fromUnixTime(contact.lastContacted),
                      { addSuffix: true }
                    )}`
                  : null}
              </span>
            </div>
            <div>
              {!!contact.activeTaskCount &&
                Array(contact.activeTaskCount)
                  .fill(null)
                  .map((_, index) => (
                    <div
                      key={`${index}+${+new Date()}`}
                      className="taskStyle "
                    />
                  ))}
            </div>
          </div>
        </li>
      );
    case 'opened':
      return (
        <li key={contact.uid} className="mb3" data-testid="openedPeopleBox">
          <PersonModal
            uid={uid}
            contactId={contact.uid}
            onClose={() => send({ type: 'CLOSED' })}
          />
        </li>
      );
    default:
      return null;
    // tk throw an error here
  }
};
