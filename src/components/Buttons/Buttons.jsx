import PropTypes from 'prop-types';
import React from 'react';
import 'tachyons';
import '../../index.css';

const propTypes = {
  /** handleClick is the primary action */
  handleClick: PropTypes.func,
  /** This is the text that goes on the button */
  name: PropTypes.string,
};

const defaultProps = {
  handleClick: () => {},
  name: 'I am a button',
};

export const SecondaryButton = ({ handleClick, name }) => (
  <button type="button" className="button2" onClick={handleClick}>
    {name}
  </button>
);

SecondaryButton.propTypes = propTypes;
SecondaryButton.defaultProps = defaultProps;
