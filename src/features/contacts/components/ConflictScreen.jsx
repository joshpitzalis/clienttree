import React from 'react';
import Portal from '../../../utils/Portal';
import { MergeManager } from './MergeManager';

export const findMatchingExistingContact = (_duplicate, _existingContacts) => {
  const cleanName = contact =>
    contact && contact.name && contact.name.toLowerCase().trim();

  const cleanEmail = contact =>
    contact && contact.email && contact.email.toLowerCase().trim();

  const bothNotBlank = (contact, duplicate) => !!contact && !!duplicate;

  // only match if the name or the email are the same, but not the same because they are both blank fields for either case
  const match = _contact =>
    (bothNotBlank(cleanName(_contact), cleanName(_duplicate)) &&
      cleanName(_contact) === cleanName(_duplicate)) ||
    (bothNotBlank(cleanEmail(_contact), cleanEmail(_duplicate)) &&
      cleanEmail(_contact) === cleanEmail(_duplicate));

  return _existingContacts.find(match);
};

export const ConflictScreen = ({
  send,
  duplicates,
  existingContacts,
  setDuplicates,
}) => {
  const handleDuplicateSelection = payload => {
    send({
      type: 'DUPLICATE_SELECTED',
      payload,
    });
  };

  const handleExistingSelection = payload => {
    send({
      type: 'EXISTING_SELECTED',
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
