import { toast$ } from '../notifications/toast';

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

  if (duplicates.length) {
    resolve(duplicates, newContacts);
    return;
  }

  add({ userId, newContacts, set, error, success });
};

export const handleResolution = (duplicates, newContacts) => {};

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
