import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@duik/it';

const inputPropTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  comment: PropTypes.string,
  label: PropTypes.string,
  rightEl: PropTypes.element,
  userId: PropTypes.string.isRequired,
  eventType: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
};
const inputDefaultProps = {
  type: 'text',
  comment: '',
  value: '',
  eventType: '',
  placeholder: '',
};

export function Input({
  value,
  name,
  placeholder,
  comment,
  type,
  label,
  rightEl,
  userId,
  eventType,
  dispatch,
}) {
  const [status, setStatus] = React.useState({});
  const [val, setValue] = React.useState(value);

  const isFirstRun = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    setStatus({ success: 'Saved.', error: '' });
  }, [value]);

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
            value={val}
            // onChange={e => setState({ ...state, [name]: e.target.value })}
          ></textarea>
        </label>
      </div>
    );
  }

  return (
    <div className="mt3 mb4 ">
      <TextField
        label={label}
        successMessage={status.success}
        errorMessage={status.error}
        type={type}
        id={name}
        placeholder={placeholder}
        value={val}
        data-testid={name}
        onKeyPress={e => {
          const notNumber = ev => Number.isNaN(parseInt(ev));
          if (type === 'number' && notNumber(e.target.value)) {
            setStatus({ success: '', error: 'Numbers only please.' });
          }
        }}
        onChange={e => {
          let inputValue;
          // if (type === 'number' && e.target.value === '') {
          //   inputValue = 0;
          // } else

          if (type === 'number') {
            inputValue = parseInt(e.target.value);
          } else {
            inputValue = e.target.value;
          }

          setStatus({ success: '', error: 'Saving...' });
          setValue(inputValue);

          if (eventType) {
            dispatch({
              type: eventType,
              payload: {
                name,
                value:
                  type === 'number' && Number.isNaN(inputValue)
                    ? 0
                    : inputValue,
                userId,
              },
            });
          }
        }}
        rightEl={rightEl}
      />
      <small id={name} className="pt3 o-50" data-testid="statusBox">
        {comment}
      </small>
    </div>
  );
}
Input.propTypes = inputPropTypes;
Input.defaultProps = inputDefaultProps;
