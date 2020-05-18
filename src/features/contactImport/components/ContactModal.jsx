
import React from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'

/* eslint-disable react/prop-types */
export const NewPeopleBox = ({
  contacts,
  userId,
  contactsToAdd,
  setContacts,
  deleteContact,
  activeContacts,
  setActiveContacts,
  setContactsToArchive,
  setNewContactList,
  newContactList
}) => {
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
          {({ index, style }) => (
            <Contact
              style={style}
              contact={contacts[index]}
              newContactList={newContactList}
              userId={userId}
              contactsToAdd={contactsToAdd}
              setContacts={setContacts}
              deleteContact={deleteContact}
              activeContacts={activeContacts}
              setActiveContacts={setActiveContacts}
              setContactsToArchive={setContactsToArchive}
              setNewContactList={setNewContactList}
            />
          )}
        </FixedSizeList>
      )}
    </AutoSizer>
  )
}

/* eslint-disable react/prop-types */
export const Contact = ({
  contact,
  userId,
  style,
  setContacts,
  deleteContact,
  contactsToAdd,
  activeContacts,
  setActiveContacts,
  setContactsToArchive,
  setNewContactList,
  newContactList
}) => {
  const { resourceName, photoURL, name, handle } = contact

  const isActive = newContactList.some((el) => el.resourceName ===
 resourceName
  )

  const handleClick = () =>
    isActive
      ? setNewContactList(oldSelection =>
        oldSelection.filter(
          ({ resourceName }) => resourceName !== contact.resourceName)
      )
      : setNewContactList(oldSelection => [...oldSelection, contact])

  return (
    <article
      style={style}
      key={resourceName}
      className={`flex items-center justify-between w-100 bb b--black-05 pb2 mt2 ${isActive && 'o-50'}`}
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
            value={isActive}
            checked={isActive}
            onChange={handleClick}
          />
          <span className="checkBox" data-state={isActive} />
        </label>
      </div>
    </article>
  )
}
