import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  className: PropTypes.string,
};

const defaultProps = {
  className: '',
};

export default function Close({ className }) {
  return (
    <React.Fragment>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`feather feather-x ${className}`}
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </React.Fragment>
  );
}

Close.propTypes = propTypes;
Close.defaultProps = defaultProps;
