import React from 'react';
import { toast$ } from '../notifications/toast';
import { setNewContact } from './contacts.api';

export const _handleImport = () => {
  const { cloudsponge } = window;
  cloudsponge.launch('gmail');
};

export const parseContacts = _contacts =>
  _contacts.map(contact => {
    const first = contact.first_name.toLowerCase();
    const last = contact.last_name.toLowerCase();
    const email = contact.__selectedMail__;
    const name = `${first} ${last}`;
    const photoURL = contact.photos[0] && contact.photos[0].value;

    return {
      name: name.trim(),
      email: email.trim(),
      photoURL,
    };
  });

export const findDuplicates = (_old, _new) =>
  _old.reduce((total, item) => {
    const nameMatch = _new.find(
      element => !!element.name && !!item.name && element.name === item.name
    );

    const emailMatch = _new.find(
      element => !!element.email && !!item.email && element.email === item.email
    );

    if (nameMatch || emailMatch) {
      total.push(item);
    }

    return total;
  }, []);

export const findBrandNewContacts = (contacts, duplicates) =>
  contacts.reduce((total, item) => {
    const nameMatch = duplicates.find(element => element.name === item.name);

    const emailMatch = duplicates.find(element => element.email === item.email);

    if (!nameMatch && !emailMatch) {
      total.push(item);
    }

    return total;
  }, []);

export const handleContactSync = ({
  userId,
  existingContacts,
  newContacts,
  resolve,
  add,
  set,
  error,
  success,
  pending,
}) => {
  const duplicates = findDuplicates(existingContacts, newContacts);

  const brandNewContacts = findBrandNewContacts(newContacts, duplicates);

  if (duplicates.length) {
    add({
      userId,
      newContacts: brandNewContacts,
      set,
      error,
      success,
      pending,
    });
    resolve(duplicates);
    return;
  }

  add({ userId, newContacts, set, error, success, pending });
};

export const handleError = (error, from) =>
  toast$.next({
    type: 'ERROR',
    message: error && error.message ? error.message : error,
    from,
  });

export const handleSuccessfulCompletion = () =>
  toast$.next({
    type: 'SUCCESS',
    message: 'Contacts Imported Successfully',
  });

export const handlePending = () =>
  toast$.next({
    message: 'Contacts Importing...',
  });

export const handleAddition = ({
  userId,
  newContacts,
  set,
  error,
  success,
  pending,
}) => {
  pending();
  const writeOps = newContacts.map(contact => set(userId, contact));

  return Promise.all(writeOps)
    .then(success)
    .catch(_error => error(_error, 'contacts/handleAddition'));
};

export const useCloudsponge = ({
  userId,
  existingContacts,
  send,
  setDuplicates,
}) => {
  const { cloudsponge } = window;

  React.useEffect(() => {
    const processContacts = contacts => {
      send('CONTACTS_SELECTED');
      const newContacts = parseContacts(contacts);
      handleContactSync({
        userId,
        existingContacts,
        newContacts,
        resolve: setDuplicates,
        add: handleAddition,
        set: setNewContact,
        error: handleError,
        success: handleSuccessfulCompletion,
        pending: handlePending,
      });
    };

    const closeModal = () => {
      cloudsponge.end();
    };

    if (cloudsponge) {
      return cloudsponge.init({
        afterSubmitContacts: processContacts,
        afterClosing: closeModal,
        include: ['photo'],
      });
    }
  }, [cloudsponge, existingContacts, userId, send, setDuplicates]);
};

export const findMatchingExistingContact = (_duplicate, _existingContacts) => {
  const cleanName = contact =>
    contact && contact.name && contact.name.toLowerCase().trim();

  const cleanEmail = contact =>
    contact && contact.email && contact.email.toLowerCase().trim();

  const bothNotBlank = (contact, duplicate) => !!contact && !!duplicate;

  const match = _contact =>
    // only match if the name or the email are the same, but not the same because they are both blank fields in either case
    (bothNotBlank(cleanName(_contact), cleanName(_duplicate)) &&
      cleanName(_contact) === cleanName(_duplicate)) ||
    (bothNotBlank(cleanEmail(_contact), cleanEmail(_duplicate)) &&
      cleanEmail(_contact) === cleanEmail(_duplicate));

  return _existingContacts.find(match);
};
