import React from 'react';
import { ContactCard } from './ContactCard';

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

  return _existingContacts && _existingContacts.find(match);
};

export const MergeManager = ({
  send,
  duplicates,
  existingContacts,
  handleDuplicateSelection,
  handleExistingSelection,
}) => {
  const [index, setIndex] = React.useState(0);
  const lastcontact = index + 1 === duplicates.length;
  // if (index === duplicates.length) {
  //   send('CLOSED');
  // }
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
  );
};
