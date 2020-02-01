// import GoogleContacts from 'react-google-contacts';
// import Avatar from 'react-avatar';

import React from 'react';
import {
  _handleImport,
  parseContacts,
  handleContactSync,
  handleResolution,
  handleAddition,
} from './contacts.helpers.js';
import { setNewContact } from './contacts.api';

const { cloudsponge } = window;

// const responseCallback = response => {
//   console.log(response);
// };

const ImportContacts = ({
  handleImport = _handleImport,
  userId,
  existingContacts,
}) => {
  React.useEffect(() => {
    const processContacts = contacts => {
      const newContacts = parseContacts(contacts);
      handleContactSync({
        userId,
        existingContacts,
        newContacts,
        resolve: handleResolution,
        add: handleAddition,
        set: setNewContact,
      });
    };
    return (
      cloudsponge &&
      cloudsponge.init({
        afterSubmitContacts: processContacts,
        afterClosing: cloudsponge.end(),
      })
    );
  }, [existingContacts, userId]);

  return (
    <button
      onClick={handleImport}
      type="button"
      className="btn3 b grow  ph3 pv2  pointer bn br1 white"
      data-testid="importContacts"
    >
      Import Contacts
    </button>

    // https://github.com/Sitebase/react-avatar
    // <Avatar
    //   // email="joshpitzalis@gmail.com"
    //   // facebookId="9gag"
    //   // twitterHandle="@rvervoort"
    //   // name='Yo'
    //   // instagram
    //   // skypeId
    // />

    // // https://www.npmjs.com/package/react-google-contacts
    // <GoogleContacts
    //   clientId="643234844871-gpn7ad38lekg90vevf8ioeblkldlp6fa.apps.googleusercontent.com"
    //   buttonText="Import Contacts"
    //   onSuccess={responseCallback}
    //   onFailure={responseCallback}
    // />
  );
};
export default ImportContacts;
