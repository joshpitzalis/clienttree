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

export const parseContacts = _contacts =>
  _contacts.map(contact => {
    const first = contact.first_name.toLowerCase();
    const last = contact.last_name.toLowerCase();
    const email = contact.__selectedMail__;
    const name = `${first} ${last}`;
    return { name: name.trim(), email: email.trim() };
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

export const handleContactSync = (
  oldContacts,
  newContacts,
  handleResolution,
  handleAddition
) => {
  const duplicates = findDuplicates(oldContacts, newContacts);

  if (duplicates.length) {
    handleResolution(duplicates, newContacts);
    return;
  }

  handleAddition(newContacts);
};

export const handleResolution = (duplicates, newContacts) => {};

export const handleAddition = () => {};

const ImportContacts = ({ handleImport = _handleImport }) => {
  const processContacts = contacts => {
    const existingContact = [];
    const newContacts = parseContacts(contacts);

    handleContactSync(
      existingContact,
      newContacts,
      handleResolution,
      handleAddition
    );
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
