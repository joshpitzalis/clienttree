import React from 'react';
import GoogleContacts from 'react-google-contacts';
import Avatar from 'react-avatar';

const { cloudsponge } = window;

const _handleImport = () => {
  cloudsponge.launch('gmail');
};

// const responseCallback = response => {
//   console.log(response);
// };

const ImportContacts = ({ handleImport = _handleImport }) => {
  const processContacts = _contacts => {
    // 1.parse contacts for required fields only (name/email)
    // 2.get all existing contacts
    // 3.check for duplicate name/emails
    // 4.if comflict give option ot merge or create new
    console.log({
      _contacts,
    });
  };

  React.useEffect(
    () =>
      cloudsponge &&
      cloudsponge.init({
        afterSubmitContacts: processContacts,
        afterClosing: cloudsponge.end(),
      }),
    []
  );

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
