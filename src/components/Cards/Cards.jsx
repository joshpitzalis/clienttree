import PropTypes from 'prop-types'
import React from 'react'
import 'tachyons'
import '../../tailwind.generated.css'

const propTypes = {
  contact: PropTypes.shape({
    photoURL: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }),
  testid: PropTypes.string,

  existing: PropTypes.bool,
  isLastContact: PropTypes.bool,

  selector: PropTypes.func,
  setIndex: PropTypes.func,
  send: PropTypes.func.isRequired,
  selectCard: PropTypes.func.isRequired
}

const defaultProps = {
  contact: {
    photoURL: 'http://tachyons.io/img/avatar_1.jpg',
    name: 'Example',
    email: 'Exa@mp.le'
  },
  testid: 'mockTestId',

  existing: true,
  isLastContact: false,

  selector: () => {},
  setIndex: () => {}
}

export const ContactCard = ({
  contact,
  testid,
  selector,
  setIndex,
  existing,
  isLastContact,
  send,
  selectCard
}) => {
  const avatarCreator = _contact =>
    _contact && _contact.photoURL
      ? _contact.photoURL
      : `https://ui-avatars.com/api/?name=${
          _contact && _contact.name ? _contact.name : 'Jane Doe'
        }`

  return (
    <div style={{ height: '350px' }}>
      <button
        type="button"
        onClick={() =>
          selectCard({
            setIndex,
            existing,
            selector,
            contact,
            isLastContact,
            send
          })
        }
        className="w5 center bg-white br4  mb4 ba grow b--black-10 pointer b--green-hover"
        data-testid={testid}
      >
        <div className="tc ">
          <img
            src={avatarCreator(contact)}
            className="br-100 h4 w4 dib ba b--black-05 pa2 mt4"
            alt={contact && contact.name ? contact.name : 'No Name'}
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
  )
}

ContactCard.propTypes = propTypes
ContactCard.defaultProps = defaultProps
