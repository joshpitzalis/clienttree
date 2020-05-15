import React from 'react'
import Portal from '../../../utils/Portal'
import { MergeManager } from './MergeManager'

/* eslint-disable react/prop-types */
export const ConflictScreen = ({
  send,
  duplicates,
  existingContacts,
  setDuplicates
}) => {
  const handleDuplicateSelection = payload => {
    send({
      type: 'DUPLICATE_SELECTED',
      payload
    })
  }

  const handleExistingSelection = payload => {
    send({
      type: 'EXISTING_SELECTED',
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
