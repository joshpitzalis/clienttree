import React from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import fromUnixTime from 'date-fns/fromUnixTime';
import PropTypes from 'prop-types';
import { useMachine } from '@xstate/react';
import { Machine } from 'xstate';
import { PersonModal } from './PersonBox';

const peopleMachine = Machine({
  id: 'people',
  initial: 'closed',
  states: {
    closed: {
      on: {
        OPENED: 'opened',
      },
    },
    opened: {
      on: {
        CLOSED: 'closed',
      },
    },
  },
});

const isValidDate = timestamp => new Date(timestamp).getTime() > 0;

export const Person = ({
  setSelectedUser,
  setVisibility,
  contact,
  selectedUser,
}) => {
  const [current, send] = useMachine(peopleMachine);

  switch (current.value) {
    case 'closed':
      return (
        <li key={contact.uid} className="mb3" data-testid="closedPeopleBox">
          <div
            className="flex items-center lh-copy pa3 ph0-l bb b--black-10 pointer bg-white"
            onClick={() => send({ type: 'OPENED' })}
            tabIndex={-1}
            onKeyPress={() => send({ type: 'OPENED' })}
            role="button"
            data-testid="openBox"

            // tabIndex={-1}
            // role="button"
            // onClick={() => {
            //   setSelectedUser(contact.uid);
            //   setVisibility(true);
            // }}
            // onKeyPress={() => {
            //   setSelectedUser(contact.uid);
            //   setVisibility(true);
            // }}
          >
            <img
              alt={contact.name}
              className="w2 h2 w3-ns h3-ns br-100"
              src={contact.photoURL}
            />
            <div className="pl3 flex-auto">
              <span className="f6 db black-70 b">{contact.name}</span>
              <span className="f6 db black-70 i">
                {contact.lastContacted &&
                isValidDate(fromUnixTime(contact.lastContacted))
                  ? `Last contacted ${
                      formatDistanceToNow(fromUnixTime(contact.lastContacted), {
                        addSuffix: true,
                      })
                      // format(
                      //   fromUnixTime(contact.lastContacted),
                      //   'Do MMM YYYY'
                      // )
                    }`
                  : null}
              </span>
            </div>
            <div>
              {!!contact.activeTaskCount &&
                Array(contact.activeTaskCount)
                  .fill(null)
                  .map((count, index) => (
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
            uid={contact.uid}
            selectedUserUid={selectedUser}
            onClose={() => send({ type: 'CLOSED' })}
          />
        </li>
      );
    default:
      return null;
    // tk throw an error here
  }
};

Person.propTypes = {
  setVisibility: PropTypes.func.isRequired,
  setSelectedUser: PropTypes.func.isRequired,
  contact: PropTypes.shape({
    uid: PropTypes.string,
    lastContacted: PropTypes.bool,
    activeTaskCount: PropTypes.number,
    name: PropTypes.string,
    photoURL: PropTypes.string,
  }).isRequired,
  selectedUser: PropTypes.shape({
    uid: PropTypes.string,
    lastContacted: PropTypes.bool,
    activeTaskCount: PropTypes.number,
    name: PropTypes.string,
    photoURL: PropTypes.string,
  }).isRequired,
};
Person.defaultProps = {};
