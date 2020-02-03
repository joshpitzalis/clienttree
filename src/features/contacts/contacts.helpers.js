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
    const nameMatch = _new.find(element => element.name === item.name);

    const emailMatch = _new.find(element => element.email === item.email);

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
}) => {
  const duplicates = findDuplicates(existingContacts, newContacts);

  const brandNewContacts = findBrandNewContacts(newContacts, duplicates);

  if (duplicates.length) {
    add({ userId, newContacts: brandNewContacts, set, error, success });
    resolve(duplicates);
    return;
  }

  add({ userId, newContacts, set, error, success });
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

export const handleAddition = ({
  userId,
  newContacts,
  set,
  error,
  success,
}) => {
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
      });
    };

    const closeModal = () => {
      send('CONTACTS_SELECTED');
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
