import React from 'react';
import PropTypes from 'prop-types';
import AvatarGenerator from 'react-avatar-generator';
import { NetworkContext } from './NetworkContext';

const modalPropTypes = {
  uid: PropTypes.string.isRequired,
  selectedUser: PropTypes.shape({
    name: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
    lastContacted: PropTypes.string.isRequired,
    photoURL: PropTypes.string.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
};
const modalDefaultProps = {};

export function Modal({ uid, selectedUser, onClose }) {
  const [state, setState] = React.useState({
    userId: uid,
    name: selectedUser.name || '',
    summary: selectedUser.summary || '',
    lastContacted: selectedUser.lastContacted || '',
    contactId: selectedUser.uid || '',
    photoURL: selectedUser.photoURL || '',
    imgString: '',
  });

  const { setContact } = React.useContext(NetworkContext);

  const avatarRef = React.useRef(null);

  return (
    <form
      className="measure"
      onSubmit={async e => {
        e.preventDefault();
        // tk validity check goes here
        if (!state.photoURL) {
          const imgString = await avatarRef.current.getImageData();

          await setContact({ ...state, imgString });
          onClose();
          return;
        }
        await setContact(state);
        onClose();
      }}
    >
      <fieldset id="contact" className="ba b--transparent ph0 mh0 tl">
        <legend className="f4 fw6 ph0 mh0 dn">Profile</legend>
        <div className="w-100 tc">
          {state.photoURL ? (
            <img
              alt={state.name}
              className="w2 h2 w3-ns h3-ns br-100"
              src={state.photoURL}
            />
          ) : (
            <AvatarGenerator ref={avatarRef} height="100" width="100" />
          )}
        </div>
        <div className="mt3 mb4">
          <label className="db fw6 lh-copy f6" htmlFor="name">
            Name
            <input
              className="db border-box hover-black w-100 measure-wide ba b--black-20 pa2 br2 mb2"
              type="text"
              name="name"
              id="name"
              placeholder="Your name..."
              value={state.name}
              onChange={e => setState({ ...state, name: e.target.value })}
            />
          </label>
        </div>

        <div className="mt3 mb4">
          <label className="db fw6 lh-copy f6" htmlFor="name">
            Last Contacted
            <input
              className="db border-box hover-black w-100 measure-wide ba b--black-20 pa2 br2 mb2"
              type="text"
              name="lastContacted"
              id="lastContacted"
              placeholder="Last contacted..."
              value={state.lastContacted}
              onChange={e =>
                setState({ ...state, lastContacted: e.target.value })
              }
            />
          </label>
        </div>

        <div className="mb4">
          <label htmlFor="comment" className="f6 b db mb2">
            Summary
            <textarea
              id="comment"
              name="comment"
              className="db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb2"
              aria-describedby="comment-desc"
              placeholder="The thing I help with..."
              value={state.summary}
              onChange={e => setState({ ...state, summary: e.target.value })}
            ></textarea>
          </label>
        </div>
      </fieldset>
      <div className="mt3">
        <input
          className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
          type="submit"
          value="Save"
        />
      </div>
    </form>
  );
}
Modal.propTypes = modalPropTypes;
Modal.defaultProps = modalDefaultProps;
