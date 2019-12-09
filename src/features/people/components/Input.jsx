import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';

const moment = require('moment');

const inputPropTypes = {
  setState: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  state: PropTypes.shape({
    userId: PropTypes.string,
    name: PropTypes.string,
    summary: PropTypes.string,
    tracked: PropTypes.bool,
    lastContacted: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    contactId: PropTypes.string,
    photoURL: PropTypes.string,
    imgString: PropTypes.string,
  }),
  type: PropTypes.string,
};
const inputDefaultProps = {
  type: 'text',
  state: {},
};

function isValidDate(date) {
  return (
    date &&
    Object.prototype.toString.call(date) === '[object Date]' &&
    !Number.isNaN(date)
  );
}

export function Input({ setState, state, value, name, placeholder, type }) {
  if (type === 'date') {
    return (
      <div className="mb4">
        <DatePicker
          size="large"
          format="DD-MM-YYYY"
          onChange={date => setState({ ...state, [name]: moment(date).unix() })}
          value={isValidDate(new Date(value)) ? moment.unix(value) : null}
          disabledDate={date => date > moment()}
        />
      </div>
    );
  }
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
