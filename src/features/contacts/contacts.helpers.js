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
    return {
      name: name.trim(),
      email: email.trim(),
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
  handleResolution,
  handleAddition,
  setNewContact,
}) => {
  const duplicates = findDuplicates(existingContacts, newContacts);

  if (duplicates.length) {
    handleResolution(duplicates, newContacts);
    return;
  }

  handleAddition(userId, newContacts, setNewContact);
};

export const handleResolution = (duplicates, newContacts) => {};

export const handleAddition = (userId, newContacts, setNewContact) => {
  const writeOps = newContacts.map(contact => setNewContact(userId, contact));

  return Promise.all(writeOps)
    .then(function(values) {
      console.log(values);
    })
    .catch(error => console.log(error));
};
