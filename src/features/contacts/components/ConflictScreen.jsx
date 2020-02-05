import React from 'react';
import Portal from '../../../utils/Portal';
import { findMatchingExistingContact } from '../contacts.helpers';

export const ConflictScreen = ({ send, duplicates, existingContacts }) => {
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

export const MergeManager = ({
  send,
  duplicates,
  existingContacts,
  handleDuplicateSelection,
  handleExistingSelection,
}) => {
  const [index, setIndex] = React.useState(0);
  const lastcontact = index + 1 === duplicates.length;
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
      {/* <button
        type="button"
        className="btn3 ph3 pv2 bn pointer br1 b mb4 w5 center"
      >
        Overwrite all duplicates with new contact info.
      </button> */}
      <p className="text3 i mb3">
        Click on the one you want to keep to proceed...
      </p>
    </div>
  );
};

function ContactCard({
  contact,
  testid,
  selector,
  setIndex,
  existing,
  isLastContact,
  send,
}) {
  const avatarCreator = _contact => {
    if (_contact && _contact.photoURL) {
      return _contact.photoURL;
    }

    if (_contact && _contact.name) {
      return `https://ui-avatars.com/api/?name=${_contact.name}`;
    }
  };

  const handleClick = () => {
    setIndex(prev => prev + 1);
    if (isLastContact) {
      send('CLOSED');
    }
    if (existing) {
      selector({ ...contact, uid: existing.uid });
      return;
    }
    selector(contact);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w5 center bg-white br3 pa3 pa4-ns mv3 ba b--black-10 grow pointer b--green-hover"
      data-testid={testid}
    >
      <div className="tc">
        <img
          src={avatarCreator(contact)}
          className="br-100 h4 w4 dib ba b--black-05 pa2"
          alt="kitty staring at you"
        />
        <h1 className="f3 mb2">
          {contact && contact.name ? contact.name : 'No email'}
        </h1>
        <h2 className="f5 fw4 gray mt0">
          {contact && contact.email ? contact.email : 'No email'}
        </h2>
      </div>
    </button>
  );
}
