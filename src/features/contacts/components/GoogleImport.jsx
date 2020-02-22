// import GoogleContacts from 'react-google-contacts';
import React from 'react';
import { Menu, Dropdown, Icon } from 'antd';
import firebase from '../../../utils/firebase';

const responseCallback = response => {
  console.log(response);
};

export default function GoogleImport({ children }) {
  const saveContacts = _contacts => {
    console.log(_contacts);
  };

  const fetchContacts = _gapi =>
    _gapi.client.people.people.connections
      .list({
        resourceName: 'people/me',
        pageSize: 2000,
        personFields:
          'addresses,biographies,coverPhotos,emailAddresses,genders,metadata,names,nicknames,occupations,organizations,phoneNumbers,photos,residences,urls',
      })
      .then(response => {
        const { connections } = response.result;

        // return connections.map(person => ({
        //   resourceName: person.resourceName,
        //   name:
        //     person &&
        //     person.names &&
        //     person.names.length > 0 &&
        //     person.names[0].displayName
        //       ? person.names[0].displayName
        //       : null,
        //   photoURL:
        //     person &&
        //     person.photos &&
        //     person.photos.length > 0 &&
        //     person.photos[0].url
        //       ? person.photos[0].url
        //       : null,
        // address:  person &&
        //   person.addresses &&
        //   person.addresses.length > 0 &&
        //   person.addresses[0] ?
        //   person.addresses[0] : null,
        // }));
        return {
          ageRanges: connections.filter(person => !!person.ageRanges),
          biographies: connections.filter(person => !!person.biographies),
          birthdays: connections.filter(person => !!person.birthdays),
          braggingRights: connections.filter(person => !!person.braggingRights),

          coverPhotos: connections.filter(person => !!person.coverPhotos),
          emailAddresses: connections.filter(person => !!person.emailAddresses),
          events: connections.filter(person => !!person.events),
          genders: connections.filter(person => !!person.genders),

          imClients: connections.filter(person => !!person.imClients),
          interests: connections.filter(person => !!person.interests),
          locales: connections.filter(person => !!person.locales),
          metadata: connections.filter(person => !!person.metadata),

          occupations: connections.filter(person => !!person.occupations),
          organizations: connections.filter(person => !!person.organizations),
          phoneNumbers: connections.filter(person => !!person.phoneNumbers),
          relations: connections.filter(person => !!person.relations),

          relationshipInterests: connections.filter(
            person => !!person.relationshipInterests
          ),
          relationshipStatuses: connections.filter(
            person => !!person.relationshipStatuses
          ),
          residences: connections.filter(person => !!person.residences),
          sipAddresses: connections.filter(person => !!person.sipAddresses),

          skills: connections.filter(person => !!person.skills),
          taglines: connections.filter(person => !!person.taglines),
          urls: connections.filter(person => !!person.urls),
          userDefined: connections.filter(person => !!person.userDefined),
        };
      })
      .then(saveContacts);

  const login = async () => {
    const { gapi } = window;
    const googleAuth = gapi.auth2.getAuthInstance();
    await googleAuth.signIn();
    fetchContacts(gapi);
  };

  return (
    // <GoogleContacts
    //   clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
    //   onSuccess={responseCallback}
    //   onFailure={responseCallback}
    // >
    //   {/* {children} */}
    // </GoogleContacts>

    <button
      onClick={() => login()}
      type="button"
      className="btn3 b grow  mh3 tl pv2  pointer bn br1 white"
      data-testid="importContacts"
    >
      Import from
      <Icon type="google" className="pl2" />
    </button>
  );
}
