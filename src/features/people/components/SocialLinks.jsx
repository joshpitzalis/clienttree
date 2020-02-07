import React, { useState } from 'react';
import { Icon } from 'antd';

export function SocialLinks({ contact, setState }) {
  const { email } = contact;

  const [details, setDetails] = useState({ type: '', value: '' });

  const [editable, makeEditable] = useState(false);

  const [value, setValue] = useState(email || '');

  return (
    <div className="flex justify-end items-baseline pv3 tr">
      <div>
        {details &&
          details.type &&
          (editable ? (
            <label htmlFor="email" className="mr4">
              {/* <span className="text3">Email</span> */}
              <input
                className="db border-box hover-black w-100 measure-narrow ba b--black-20 pa2 br2 mb2 ttc"
                type="text"
                name="email"
                id="email"
                data-testid="emailDetails"
                placeholder="Add email..."
                value={value}
                onChange={e => {
                  const text = e.target.value;

                  setValue(text);

                  setState(prevState => ({
                    ...prevState,
                    email: text,
                    saving: true,
                  }));
                }}
              />
            </label>
          ) : (
            <button
              type="button"
              className="pointer bn"
              onClick={() => makeEditable(true)}
            >
              <p>
                {details && details.value
                  ? details.value
                  : 'Click here to add email...'}
              </p>
            </button>
          ))}
      </div>
      <div>
        {details && details.type ? (
          <button
            type="button"
            className="pointer bn"
            onClick={() => {
              makeEditable(false);
              setDetails({ type: '', value: '' });
            }}
          >
            <Icon type="close-circle" className="ml2" />
          </button>
        ) : (
          <button
            type="button"
            className={`mh2 pointer bn ${!email && 'o-50'}`}
            onClick={() => setDetails({ type: 'email', value: email })}
          >
            <Icon theme="twoTone" twoToneColor="#7f7f7f" type="mail" />
          </button>
        )}
      </div>
    </div>
  );
}
