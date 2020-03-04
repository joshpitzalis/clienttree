// import GoogleContacts from 'react-google-contacts';
import { Icon } from 'antd';
import React from 'react';
import { markImported, saveImportedContacts } from '../contacts.api';
import { contactCleaner } from '../contacts.helpers';

export const brandNewContacts = (_new, _existing) =>
  _new.reduce((total, item) => {
    const nameMatch = _existing.some(element => element.name === item.name);

    const emailMatch = _existing.some(element => element.email === item.email);

    if ((!nameMatch && !emailMatch) || (!nameMatch && !item.email)) {
      total.push(item);
    }

    return total;
  }, []);

export const findConflict = (newContacts, old) => {
  // NAME_MATCHES      EMAIL_MATCHES    CONFLICT
  // true              true             false (identical)
  // true              false            true
  // false             true             true
  // false             false            false

  const findMatch = (_new, _old, matcher) =>
    _old.find(element => element[matcher] === _new[matcher]);

  const duplicates = newContacts.filter(
    item => findMatch(item, old, 'name') !== findMatch(item, old, 'email')
  );
  return duplicates.filter(
    // only return duplicates that have an email and name field
    // so no blank fields on incoming conflicts
    _item =>
      // (_item.email !== '' || _item.email !== null) &&
      // (_item.name !== '' || _item.name !== null)
      _item.email && _item.name
  );
};

// export const findMatches = (newContacts, old) => {
//   const findMatch = (_new, _old, matcher) =>
//     _old.find(element => element[matcher] === _new[matcher]);

//   return newContacts.filter(
//     item => findMatch(item, old, 'name') && findMatch(item, old, 'email')
//   );
// };

const personFields =
  'addresses,emailAddresses,genders,metadata,names,occupations,organizations,phoneNumbers,photos,residences';

const getContacts = (_gapi, _nextPageToken) =>
  _gapi.client.people.people.connections
    .list({
      resourceName: 'people/me',
      pageSize: 2000,
      personFields,
      pageToken: _nextPageToken,
    })
    .then(response => {
      const { connections, nextPageToken } = response.result;
      return { people: connections, nextPageToken };
    });

const getAllContacts = async (_people, _token, _gapi) => {
  if (_people.length < 2000) {
    // terminal case
    const result = await getContacts(_gapi, _token);
    return _people.push(...result.people);
  }

  // block to execute
  const { people, nextPageToken } = await getContacts(_gapi, _token);
  _people.push(...people);
  getAllContacts(people, nextPageToken, _gapi);
};

export default function GoogleImport({
  userId,
  existingContacts,
  setConflicts,
  setContactPicker,
}) {
  const fetchContacts = _gapi =>
    _gapi.client.people.people.connections
      .list({
        resourceName: 'people/me',
        pageSize: 2000,
        personFields,
      })
      .then(async response => {
        const { connections, nextPageToken } = response.result;
        const contacts = [...connections];

        if (contacts.length >= 2000) {
          await getAllContacts(contacts, nextPageToken, _gapi);
        }

        console.log('contacts.length', contacts.length);
        return contacts;
      })
      .then(connections => contactCleaner(connections))
      .then(newContacts => {
        const conflicts = findConflict(newContacts, existingContacts);
        const brandNew = brandNewContacts(newContacts, existingContacts);

        if (conflicts.length) {
          setConflicts(conflicts);
        } else {
          setContactPicker(true);
        }

        return brandNew;
      })
      .then(contacts => saveImportedContacts(contacts, userId))
      .then(() => markImported(userId))
      .catch(console.error);

  const login = async () => {
    const { gapi } = window;
    const googleAuth = gapi.auth2.getAuthInstance();
    googleAuth
      .signIn()
      .then(() => fetchContacts(gapi))
      .catch(error => console.log({ error }));
  };

  return (
    <button
      onClick={() => login()}
      type="button"
      className="btn3 b black grow mr2  tl pv2  pointer bn br1 white"
      data-testid="importContacts"
    >
      Import
      <Icon type="google" className="pl1" />
      oogle Contacts
    </button>
  );
}
