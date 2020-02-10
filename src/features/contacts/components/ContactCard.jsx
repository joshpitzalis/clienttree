import React from 'react';

const handleClick = ({
  setIndex,

  selector,
  contact,
  isLastContact,
  send,
}) => {
  setIndex(prev => prev + 1);

  selector(contact);

  if (isLastContact) {
    send('CLOSED');
  }
};

const handleExistingClick = ({
  setIndex,
  existing,
  selector,
  contact,
  isLastContact,
  send,
}) => {
  setIndex(prev => prev + 1);
  selector({ ...contact, uid: existing.uid });
  if (isLastContact) {
    send('CLOSED');
  }
};

export function ContactCard({
  contact,
  testid,
  selector,
  setIndex,
  existing,
  isLastContact,
  send,
}) {
  const avatarCreator = _contact => {
    if (_contact && _contact.photoURL) {
      return _contact.photoURL;
    }
    if (_contact && _contact.name) {
      return `https://ui-avatars.com/api/?name=${_contact.name}`;
    }
  };

  const clickHandler = () =>
    existing
      ? handleExistingClick({
          setIndex,
          existing,
          selector,
          contact,
          isLastContact,
          send,
        })
      : handleClick({
          setIndex,
          selector,
          contact,
          isLastContact,
          send,
        });

  return (
    <button
      type="button"
      onClick={clickHandler}
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
}
