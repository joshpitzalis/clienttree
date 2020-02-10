import React from 'react';

const handleClick = ({
  setIndex,
  existing,
  selector,
  contact,
  isLastContact,
  send,
}) => {
  setIndex(prev => prev + 1);

  if (isLastContact) {
    send('CLOSED');
  }

  if (existing) {
    selector({ ...contact, uid: existing.uid });
    return;
  }

  return selector(contact);
};

const avatarCreator = _contact =>
  _contact && _contact.photoURL
    ? _contact.photoURL
    : `https://ui-avatars.com/api/?name=${_contact.name}`;

export const ContactCard = ({
  contact,
  testid,
  selector,
  setIndex,
  existing,
  isLastContact,
  send,
}) => (
  <button
    type="button"
    onClick={() =>
      handleClick({
        setIndex,
        existing,
        selector,
        contact,
        isLastContact,
        send,
      })
    }
    className="w5 center bg-white br3 pa3 pa4-ns mv3 ba b--black-10 grow pointer b--green-hover"
    data-testid={testid}
  >
    <div className="tc">
      <img
        src={avatarCreator(contact)}
        className="br-100 h4 w4 dib ba b--black-05 pa2"
        alt="kitty staring at you"
      />
      <h1 className="f3 mb2">
        {contact && contact.name ? contact.name : 'No email'}
      </h1>
      <h2 className="f5 fw4 gray mt0">
        {contact && contact.email ? contact.email : 'No email'}
      </h2>
    </div>
  </button>
);
