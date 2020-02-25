// import GoogleContacts from 'react-google-contacts';
import React from 'react';
import { Icon } from 'antd';
import { contactCleaner } from '../contacts.helpers.js';
import { saveImportedContacts } from '../contacts.api.js';

export default function GoogleImport({ userId }) {
  const personFields =
    'addresses,emailAddresses,genders,metadata,names,occupations,organizations,phoneNumbers,photos,residences';

  const fetchContacts = _gapi =>
    _gapi.client.people.people.connections
      .list({
        resourceName: 'people/me',
        pageSize: 2000,
        personFields,
      })
      .then(response => {
        const { connections } = response.result;
        return contactCleaner(connections);
      })
      .then(contacts => saveImportedContacts(contacts, userId))
      .then(() => setModal(true));

  const login = async () => {
    const { gapi } = window;
    const googleAuth = gapi.auth2.getAuthInstance();
    await googleAuth.signIn();
    fetchContacts(gapi);
  };

  return (
    <button
      onClick={() => login()}
      type="button"
      className="btn3 b grow  mh3 tl pv2  pointer bn br1 white"
      data-testid="importContacts"
    >
      Import from
      <Icon type="google" className="pl1" />
      oogle
    </button>
  );
}
