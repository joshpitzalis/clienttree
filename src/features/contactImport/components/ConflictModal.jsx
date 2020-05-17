import React from 'react'
import { ContactCard } from '../../../components/Cards/Cards'
import Portal from '../../../utils/Portal'
import {
  contactCardSelect,
  findMatchingExistingContact
} from '../contacts.helpers'
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

  return (
    <div
      data-testid="conflictScreen"
      className="flex flex-column justify-center pv3"
    >
      <p className="">{`${index + 1} / ${
        duplicates.length
      } Conflicts. Pick one to proceed...`}</p>

      <div className="flex mb3 justify-around">
        <div className="flex flex-column justify-center">
          <p className="f3 fw5 mb1 pb1  b">Existing</p>
          <ContactCard
            contact={findMatchingExistingContact(
              duplicates[index],
              existingContacts
            )}
            testid="existingContact"
            selector={handleExistingSelection}
            setIndex={setIndex}
            send={send}
            isLastContact={lastcontact}
            existing={null}
            selectCard={contactCardSelect}
          />
        </div>
        <div className="flex flex-column justify-center">
          <p className="f3 fw5 mb1 pb1">New</p>
          <ContactCard
            contact={duplicates[index]}
            testid="newContact"
            selector={handleDuplicateSelection}
            setIndex={setIndex}
            existing={findMatchingExistingContact(
              duplicates[index],
              existingContacts
            )}
            send={send}
            isLastContact={lastcontact}
            selectCard={contactCardSelect}
          />
        </div>
      </div>

      <div className="flex justify-around items-baseline ma4 pt3">
        <button
          type="button"
          className="button2"
          onClick={() => send('SKIP_ALL')}
        >
          Skip all
          {/* conflicts and Keep all existing contacts */}
        </button>

        <button
          type="button"
          className="button2"
          onClick={() => send({ target: 'MERGE_ALL', payload: duplicates })}
        >
          Merge all
          {/* New Contacts in one go */}
        </button>
      </div>
    </div>
  )
}
/* eslint-disable react/prop-types */
export const ConflictScreen = ({
  send,
  duplicates,
  existingContacts,
  setDuplicates
}) => {
  const handleDuplicateSelection = payload => {
    send({
      type: 'MERGE_ONE',
      payload
    })
  }

  const handleExistingSelection = payload => {
    send({
      type: 'SKIP_ONE',
      payload
    })
  }

  // fire on unmount only
  React.useEffect(() => () => setDuplicates([]), [setDuplicates])

  return (
    <Portal
      onClose={() => {
        send('CLOSED')
      }}
    >
      <MergeManager
        send={send}
        duplicates={duplicates}
        existingContacts={existingContacts}
        handleDuplicateSelection={handleDuplicateSelection}
        handleExistingSelection={handleExistingSelection}
      />
    </Portal>
  )
}
