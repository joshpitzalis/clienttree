// import { assert } from 'chai';
import { useMachine } from '@xstate/react'
import React from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'
import { Machine } from 'xstate'

/* eslint-disable react/prop-types */
export const NewPeopleBox = ({
  contacts,
  userId,
  contactsToAdd,
  setContacts,
  deleteContact,
  activeContacts,
  setActiveContacts,
  setContactsToArchive
}) => {
  const Row = ({ index, style }) => (
    <Contact
      style={style}
      contact={contacts[index]}
      userId={userId}
      // activateContact={_activateContact}
      // archiveContact={_archiveContact}
      // trashContact={_trashContact}
      contactsToAdd={contactsToAdd}
      setContacts={setContacts}
      deleteContact={deleteContact}
      activeContacts={activeContacts}
      setActiveContacts={setActiveContacts}
      setContactsToArchive={setContactsToArchive}
    />
  )

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
          {Row}
        </FixedSizeList>
      )}
    </AutoSizer>
  )
}

export const contactMachine = Machine({
  id: 'contact',
  initial: 'archived',
  states: {
    archived: {
      on: {
        ALREADY_ACTIVATED: 'active',
        ACTIVATED: { target: 'active', actions: ['addContact'] },
        TRASHED: { target: 'trashed', actions: ['trashContact'] }
      }
    },
    active: {
      on: {
        ARCHIVED: { target: 'archived', actions: ['removeContact'] }
      }
    },
    trashed: {
      type: 'final'
    }
  }
})

/* eslint-disable react/prop-types */
export const Contact = ({
  contact,
  userId,
  // activateContact,
  // archiveContact,
  // trashContact,
  style,
  setContacts,
  deleteContact,
  contactsToAdd,
  activeContacts,
  setActiveContacts,
  setContactsToArchive
}) => {
  const [current, send] = useMachine(contactMachine, {
    actions: {
      // activateContact,
      // archiveContact,
      // trashContact,
      deleteContact: (_, { payload }) =>
        deleteContact(prev => [...prev, payload]),
      addContact: (_, { payload }) => {
        setContacts(prev => [...prev, payload])
        setContactsToArchive(prev =>
          prev && prev.filter(item => item.uid !== payload.uid)
        )
      },
      removeContact: (_, { payload }) => {
        setContacts(prev => prev && prev.filter(item => item.uid !== payload.uid))
        setActiveContacts(prev =>
          prev && prev.filter(item => item.uid !== payload.uid)
        )
        setContactsToArchive(prev => [...prev, payload])
      }
    }
  })

  const { uid, photoURL, name, handle } = contact

  const checkifAdded = React.useCallback(
    (_contact, _send, _contactsToAdd) => {
      if (
        (_contactsToAdd && _contactsToAdd.some(item => item.uid === _contact.uid)) ||
        (activeContacts && activeContacts.some(item => item.uid === _contact.uid))
      ) {
        return _send('ALREADY_ACTIVATED')
      }
      return null
    },
    [activeContacts]
  )

  React.useEffect(() => {
    checkifAdded(contact, send, contactsToAdd)
  }, [contact, send, contactsToAdd, checkifAdded])

  if (current.matches('trashed')) {
    return null
  }

  const handleClick = () =>
    current.matches('active')
      ? send({ type: 'ARCHIVED', payload: { uid, userId } })
      : send({ type: 'ACTIVATED', payload: { uid, userId } })

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
                <small className="red">Remove from this list</small>
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
            onChange={handleClick}
          />
          <span className="checkBox" data-state={current.matches('active')} />
        </label>
      </div>
    </article>
  )
}
