import React from 'react'
import { ContactCard } from './ContactCard'

export const findMatchingExistingContact = (_duplicate, _existingContacts) => {
  const cleanName = contact =>
    contact && contact.name && contact.name.toLowerCase().trim()

  const cleanEmail = contact =>
    contact && contact.email && contact.email.toLowerCase().trim()

  const bothNotBlank = (contact, duplicate) => !!contact && !!duplicate

  // only match if the name or the email are the same, but not the same because they are both blank fields for either case
  const match = _contact =>
    (bothNotBlank(cleanName(_contact), cleanName(_duplicate)) &&
      cleanName(_contact) === cleanName(_duplicate)) ||
    (bothNotBlank(cleanEmail(_contact), cleanEmail(_duplicate)) &&
      cleanEmail(_contact) === cleanEmail(_duplicate))

  return _existingContacts.find(match)
}

/* eslint-disable react/prop-types */
export const MergeManager = ({
  send,
  duplicates,
  existingContacts,
  handleDuplicateSelection,
  handleExistingSelection
}) => {
  const [index, setIndex] = React.useState(0)
  const lastcontact = index + 1 === duplicates.length
  if (index === duplicates.length) {
    send('CLOSED')
  }
  return (
    <div
      data-testid='conflictScreen'
      className='flex flex-column justify-center'
    >
      <p className='f3 fw6 w-50 dib-l w-auto-l lh-title'>{`${index + 1} / ${
        duplicates.length
      } Duplicates`}
      </p>

      <div className='flex mb3'>
        <ContactCard
          contact={findMatchingExistingContact(
            duplicates[index],
            existingContacts
          )}
          testid='existingContact'
          selector={handleExistingSelection}
          setIndex={setIndex}
          send={send}
          isLastContact={lastcontact}
          existing={null}
        />

        <ContactCard
          contact={duplicates[index]}
          testid='newContact'
          selector={handleDuplicateSelection}
          setIndex={setIndex}
          existing={findMatchingExistingContact(
            duplicates[index],
            existingContacts
          )}
          send={send}
          isLastContact={lastcontact}
        />
      </div>

      <p className='text3 i mb3'>
        Click on the one you want to keep to proceed...
      </p>
    </div>
  )
}
