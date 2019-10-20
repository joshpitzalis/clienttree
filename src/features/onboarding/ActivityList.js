import React from 'react';
import PropTypes from 'prop-types';
// import { filter } from 'rxjs/operators';
import { HelpfulTaskList } from '../network/components/UniversalTaskList';
import { GettingStarted } from './GettingStarted';

const propTypes = {
  uid: PropTypes.string.isRequired,
};
const defaultProps = {};

export function Onboarding({ uid }) {
  return (
    <form className="pa4">
      <fieldset className="bn">
        {/* <legend className="fw7 mb2">
          Getting Started {1 + (submitted ? 1 : 0)}/5
        </legend> */}
        <legend className="fw7 mb2">Activities</legend>
        <GettingStarted uid={uid} />
        <HelpfulTaskList myUid={uid} />
      </fieldset>
    </form>
  );
}

Onboarding.propTypes = propTypes;
Onboarding.defaultProps = defaultProps;
