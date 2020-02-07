import { toast$ } from '../notifications/toast';

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

export const findDuplicates = (_old, newContacts) => {
  const findMatch = (_new, item, matcher) => {
    const match = _new.find(
      element =>
        !!element[matcher] &&
        !!item[matcher] &&
        element[matcher] === item[matcher]
    );

    const noMatch = _new.some(element => element[matcher] === item[matcher]);

    if (noMatch) {
      return noMatch;
    }

    if (match === undefined) {
      return 'blank';
      // this mean there was no matcher field or it was blank
    }

    return match;
  };

  return _old.reduce((total, item) => {
    if (
      findMatch(newContacts, item, 'name') !==
      findMatch(newContacts, item, 'email')
    ) {
      total.push(item);
    }

    if (
      findMatch(newContacts, item, 'name') &&
      findMatch(newContacts, item, 'email') === 'blank'
    ) {
      return total;
    }

    return total;
  }, []);
};

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
  setDuplicates,
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
    setDuplicates(duplicates);
    return;
  }

  add({ userId, newContacts, set, error, success, pending });
};

// ###

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
