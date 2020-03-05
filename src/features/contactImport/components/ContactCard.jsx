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
    send('COMPLETED');
  }
  if (existing) {
    selector({ ...contact, uid: existing.uid });
    return;
  }
  if (isLastContact) {
    send('COMPLETED');
  }
  return selector(contact);
};

const avatarCreator = _contact =>
  _contact && _contact.photoURL
    ? _contact.photoURL
    : `https://ui-avatars.com/api/?name=${
        _contact && _contact.name ? _contact.name : 'Jane Doe'
      }`;

export const ContactCard = ({
  contact,
  testid,
  selector,
  setIndex,
  existing,
  isLastContact,
  send,
}) => (
  <div style={{ height: '350px' }}>
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
      className="w5 center bg-white br4  mb4 ba grow b--black-10 pointer b--green-hover"
      data-testid={testid}
    >
      <div className="tc ">
        <img
          src={avatarCreator(contact)}
          className="br-100 h4 w4 dib ba b--black-05 pa2 mt4"
          alt="kitty staring at you"
        />
        <h1 className="f3 mb2 mh4">
          {contact && contact.name ? contact.name : 'No Name'}
        </h1>
        <h2 className="f5 fw4 gray mt0 mb4">
          {contact && contact.email ? contact.email : 'No email'}
        </h2>
      </div>
    </button>
  </div>
);
