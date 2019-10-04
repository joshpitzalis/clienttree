import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const propTypes = {
  submitted: PropTypes.bool.isRequired,
};
const defaultProps = {};

export function Onboarding({ submitted }) {
  return (
    <form className="pa4">
      <fieldset id="favorite_movies" className="bn">
        <legend className="fw7 mb2">
          Getting Started {1 + (submitted ? 1 : 0)}/5
        </legend>
        <div className="flex items-center mb2">
          <label htmlFor="spacejam" className="lh-copy">
            <input
              className="mr2"
              type="checkbox"
              id="spacejam"
              value="spacejam"
              checked
            />
            <span className="strike">Sign up to the waiting list</span>
          </label>
        </div>

        <div className="flex items-center mb2">
          <label htmlFor="spacejam" className="lh-copy">
            <input
              className="mr2"
              type="checkbox"
              id="spacejam"
              value="spacejam"
              checked={submitted}
            />
            {submitted ? (
              <span className="strike">
                Create a referrable email signature by completing your profile.
              </span>
            ) : (
              <Link to="/user/123/profile" className="f6 link dim mr3 mr4-ns">
                Create a referrable email signature by completing your profile.
              </Link>
            )}
          </label>
        </div>
        <div className="flex items-center mb2">
          <label htmlFor="spacejam" className="lh-copy">
            <input
              className="mr2"
              type="checkbox"
              id="spacejam"
              value="spacejam"
            />

            <Link to="/user/123/profile" className="f6 link dim mr3 mr4-ns">
              Actually add the signature to your email account
            </Link>
          </label>
        </div>
        <div className="flex items-center mb2">
          <label htmlFor="spacejam" className="lh-copy">
            <input
              className="mr2"
              type="checkbox"
              id="spacejam"
              value="spacejam"
            />
            <span className="">Create a referral page</span>
          </label>
        </div>
        <div className="flex items-center mb2">
          <label htmlFor="spacejam" className="lh-copy">
            <input
              className="mr2"
              type="checkbox"
              id="spacejam"
              value="spacejam"
            />
            <span className="">
              Add the name of a past client to your professional network
            </span>
          </label>
        </div>
      </fieldset>
    </form>
  );
}

Onboarding.propTypes = propTypes;
Onboarding.defaultProps = defaultProps;
