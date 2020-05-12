import React from 'react'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import fromUnixTime from 'date-fns/fromUnixTime'
import { useMachine } from '@xstate/react'
import { Machine } from 'xstate'
import { useDispatch } from 'react-redux'
// import { OptimizelyFeature } from '@optimizely/react-sdk';
import { PersonModal } from './PersonBox'
import { handleContactDelete } from '../peopleAPI'
import { toast$ } from '../../notifications/toast'
// import Check from '../../../images/Check';

export const lastContact = contact => {
  const { lastContacted, notes } = contact

  const noteDates =
    notes &&
    Object.values(notes)
      .map(note => note && note.lastUpdated)
      .filter(item => item !== 9007199254740991)

  const mostRecentNote = noteDates && Math.max(...noteDates)

  return Math.max(lastContacted, mostRecentNote)
}

const peopleMachine = Machine({
  id: 'people',
  initial: 'closed',
  states: {
    closed: {
      on: {
        OPENED: {
          target: 'opened',
          actions: ['setSelectedUser']
        }
      }
    },
    opened: {
      on: {
        CLOSED: {
          target: 'closed',
          actions: ['clearSelectedUser']
        }
      }
    }
  }
})

/**
 * @param {Date} timestamp
 */
const isValidDate = timestamp => new Date(timestamp).getTime() > 0

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

/* eslint-disable react/prop-types */
export const Person = ({ contact, uid }) => {
  const dispatch = useDispatch()

  const [current, send] = useMachine(peopleMachine, {
    actions: {
      setSelectedUser: (ctx, event) =>
        dispatch({ type: 'people/setSelectedUser', payload: event.payload }),
      clearSelectedUser: () => dispatch({ type: 'people/clearSelectedUser' })
    }
  })

  const handleDelete = async (_name, _uid, _userId) => {
    try {
      dispatch({ type: 'people/clearSelectedUser' })
      await handleContactDelete(_uid, _userId)
      send({ type: 'CLOSED' })
    } catch (error) {
      toast$.next({ type: 'ERROR', message: error.message || error })
    }
  }

  const isOverDue = _lastContacted => {
    const sixMonthsAgo = 1.577e10

    const diff = +new Date() - _lastContacted

    return diff > sixMonthsAgo
  }

  switch (current.value) {
    case 'closed':
      return (
        <li
          key={contact.uid}
          className={`mb3 ${
            isOverDue(lastContact(contact)) ? 'bl-red' : 'bl-green'
          }`}
          data-testid='closedPeopleBox'
        >
          <div
            className='flex items-center lh-copy pa3 ph0-l bb b--black-10 pointer bg-white'
            onClick={() => {
              send({ type: 'OPENED', payload: contact.uid })
            }}
            tabIndex={-1}
            onKeyPress={() => send({ type: 'OPENED', payload: contact.uid })}
            role='button'
            data-testid='openBox'
          >
            {/* {contact.photoURL ? ( */}
            <img
              alt={`${contact.name} avatar`}
              className='w2 h2 w3-ns h3-ns br-100 ml3'
              src={contact.photoURL}
            />
            {/* // ) : ( //{' '}
            <Avatar name={contact.name} email={contact.email}></Avatar>
            // )} */}
            <div className='pl3 flex-auto'>
              <span className='f6 db black-70 b'>{contact.name}</span>
              <span className='f6 db black-70 i'>
                {contact &&
                isValidDate(fromUnixTime(lastContact(contact) / 1000))
                  ? `Last interaction ${formatDistanceToNow(
                      fromUnixTime(lastContact(contact) / 1000),
                      { addSuffix: true }
                    )}`
                  : null}
              </span>
            </div>
          </div>
        </li>
      )
    case 'opened':
      return (
        <li key={contact.uid} className='mb3' data-testid='openedPeopleBox'>
          <PersonModal
            uid={uid}
            contactId={contact.uid}
            onClose={() => send({ type: 'CLOSED' })}
            handleDelete={handleDelete}
            setVisibility={() => send({ type: 'CLOSED' })}
          />
        </li>
      )
    default:
      return null
    // tk throw an error here
  }
}
