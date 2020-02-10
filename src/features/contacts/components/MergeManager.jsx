import React from 'react';
import { ContactCard } from './ContactCard';
import { findMatchingExistingContact } from './ConflictScreen';

export const MergeManager = ({
  send,
  duplicates,
  existingContacts,
  handleDuplicateSelection,
  handleExistingSelection,
}) => {
  const [index, setIndex] = React.useState(0);
  const lastcontact = index + 1 === duplicates.length;
  if (index === duplicates.length) {
    send('CLOSED');
  }
  return (
    <div
      data-testid="conflictScreen"
      className="flex flex-column justify-center"
    >
      <p className="f3 fw6 w-50 dib-l w-auto-l lh-title">{`${index + 1} / ${
        duplicates.length
      } Duplicates`}</p>

      <div className="flex mb3">
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
        />

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
        />
      </div>

      <p className="text3 i mb3">
        Click on the one you want to keep to proceed...
      </p>
    </div>
  );
};
