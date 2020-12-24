import React from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'
import { Contact } from './Contact'

/* eslint-disable react/prop-types */
export const ContactModal = ({ allContacts, uid, send, setContacts, deleteContact, contactsToAdd, activeContacts, setActiveContacts, setContactsToArchive, setNewContactList, newContactList }) => (
  <>
    <p className="f3 fw6 w-50 dib-l w-auto-l lh-title"> Select Contacts</p>
    <div className="overflow-y-auto vh-50">

      <AutoSizer>
        {({ height, width }) => (<FixedSizeList className="center" height={height} itemCount={allContacts && allContacts.length} itemSize={80} width={width}>
          {({ index, style }) => (<Contact style={style} contact={allContacts[index]} newContactList={newContactList} userId={uid} contactsToAdd={contactsToAdd} setContacts={setContacts} deleteContact={deleteContact} activeContacts={activeContacts} setActiveContacts={setActiveContacts} setContactsToArchive={setContactsToArchive} setNewContactList={setNewContactList} />)}
        </FixedSizeList>)}
      </AutoSizer>

    </div>

    <button className="btn2 pa3 br2 b bn pointer" type="button" onClick={() => send('SAVED')}>

      {contactsToAdd && contactsToAdd.length
        ? `Add ${contactsToAdd.length} ${contactsToAdd.length === 1 ? 'Contact' : 'Contacts'}`
        : 'Done for Now'}
    </button>
  </>)
