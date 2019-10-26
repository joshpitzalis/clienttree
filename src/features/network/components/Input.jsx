import React from 'react';
import PropTypes from 'prop-types';

const inputPropTypes = {
  setState: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  state: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    tracked: PropTypes.bool.isRequired,
    lastContacted: PropTypes.string.isRequired,
    contactId: PropTypes.string.isRequired,
    photoURL: PropTypes.string.isRequired,
    imgString: PropTypes.string.isRequired,
  }),
  type: PropTypes.string,
};
const inputDefaultProps = {
  type: 'text',
};
export function Input({ setState, state, value, name, placeholder, type }) {
  if (type === 'textarea') {
    return (
      <div className="mb4">
        <label htmlFor={name} className="f6 b db mb2">
          {name}
          <textarea
            name={name}
            id={name}
            rows="5"
            className="db border-box hover-black w-100 measure-narrow ba b--black-20 pa2 br2 mb2"
            aria-describedby={name}
            placeholder={placeholder}
            value={value}
            onChange={e => setState({ ...state, [name]: e.target.value })}
          ></textarea>
        </label>
      </div>
    );
  }
  return (
    <div className="mt3 mb4 ">
      <label className="db fw6 lh-copy f6 ttc " htmlFor="name">
        {name}
        <input
          className="db border-box hover-black w-100 measure-narrow ba b--black-20 pa2 br2 mb2"
          type="text"
          name={name}
          id={name}
          placeholder={placeholder}
          value={value}
          onChange={e => setState({ ...state, [name]: e.target.value })}
        />
      </label>
    </div>
  );
}
Input.propTypes = inputPropTypes;
Input.defaultProps = inputDefaultProps;