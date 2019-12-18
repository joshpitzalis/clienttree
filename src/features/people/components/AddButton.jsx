import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

export function AddButton({ setVisibility, contactCount }) {
  const [revealSupportText, setRevealSupportText] = React.useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setVisibility(true)}
        className="btn1 b grow  ph3 pv2  pointer bn br1 white"
        data-testid="addPeopleButton"
        onMouseEnter={() => setRevealSupportText(true)}
        onMouseLeave={() => setRevealSupportText(false)}
      >
        Add Someone New
      </button>
      {/* <CSSTransition
        in={contactCount < 3 && revealSupportText}
        timeout={500}
        classNames="fadeIn"
        unmountOnExit
      >
        <p className="black-50 db i">
          {
            {
              0: 'Just start by adding 3 people that you have been meaning to keep in touch with for a while.',
              1: 'Almost there. Add two more people. You can do it! 🙌 🙌 🙌',
              2: 'Add One more person. You got this! 🎉 🎉 🎉',
            }[contactCount]
          }
        </p>
      </CSSTransition> */}
    </div>
  );
}
AddButton.propTypes = {
  setVisibility: PropTypes.func.isRequired,
  contactCount: PropTypes.number,
};
AddButton.defaultProps = {
  contactCount: 0,
};
