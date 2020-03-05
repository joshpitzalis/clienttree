import React from 'react';
import Portal from '../../../utils/Portal';
import { MergeManager } from './MergeManager';

export const ConflictScreen = ({
  send,
  duplicates,
  existingContacts,
  setDuplicates,
}) => {
  const handleDuplicateSelection = payload => {
    send({
      type: 'MERGE_ONE',
      payload,
    });
  };

  const handleExistingSelection = payload => {
    send({
      type: 'SKIP_ONE',
      payload,
    });
  };

  // fire on unmount only
  React.useEffect(() => () => setDuplicates([]), [setDuplicates]);

  return (
    <Portal
      onClose={() => {
        send('CLOSED');
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
  );
};
