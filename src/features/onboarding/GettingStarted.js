import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { ONBOARDING_STEP_COMPLETED } from './onboardingConstants';

const startingPropTypes = {
  uid: PropTypes.string,
  onboarding: PropTypes.shape({
    complete: PropTypes.bool.isRequired,
    signatureCreated: PropTypes.bool.isRequired,
    addedSignatureToEmail: PropTypes.bool.isRequired,
    referralPageCreated: PropTypes.bool.isRequired,
    addedSomeone: PropTypes.bool.isRequired,
    reachOut: PropTypes.bool.isRequired,
    helpedSomeone: PropTypes.bool.isRequired,
  }),
};
const startingDefaultProps = {
  uid: '',
};

export const GettingStarted = ({ uid, onboarding }) => {
  const dispatch = useDispatch();

  // marks onboarding complete once user completes all steps
  React.useEffect(() => {
    const completeCount =
      onboarding && Object.values(onboarding).filter(_x => !!_x).length;

    if (completeCount >= 6) {
      dispatch({
        type: ONBOARDING_STEP_COMPLETED,
        payload: {
          userId: uid,
          onboardingStep: 'complete',
        },
      });
    }
  }, [dispatch, onboarding, uid]);

  return (
    <>
      <Step
        completedText={<small className="strike">Sign up to Client Tree</small>}
        value="signup"
      />
      <Step
        completedText="Completed your profile and created a referrable email signature."
        uncompletedText="Complete your profile to create a referrable email signature."
        completed={onboarding && onboarding.signatureCreated}
        value="signup"
      />
      <Step
        value="signature"
        completed={onboarding && onboarding.signatureCreated}
        disabled
        uid={uid}
        completedText="Completed your profile and created a referrable email signature."
        uncompletedText="Complete your profile to create a referrable email signature."
      />
      <Step
        value="email"
        completed={onboarding && onboarding.addedSignatureToEmail}
        uid={uid}
        completedText="Actually add the signature to your email account"
        uncompletedText="Actually add the signature to your email account"
        href="https://support.google.com/mail/answer/8395?co=GENIE.Platform%3DDesktop&hl=en"
        handleChange={() =>
          dispatch({
            type: ONBOARDING_STEP_COMPLETED,
            payload: {
              userId: uid,
              onboardingStep: 'addedSignatureToEmail',
              checked: onboarding && onboarding.addedSignatureToEmail,
            },
          })
        }
      />

      <Step
        value="referral"
        completed={onboarding && onboarding.referralPageCreated}
        uid={uid}
        completedText="Add services to your profile to create a referral page"
        uncompletedText="Add services to your profile to create a referral page"
      />

      <Step
        value="addedSomeone"
        completed={onboarding && onboarding.addedSomeone}
        uid={uid}
        completedText="Add someone to your professional network"
        uncompletedText="Add someone to your professional network"
      />

      <Step
        value="reachOut"
        completed={onboarding && onboarding.reachOut}
        uid={uid}
        completedText="Reach out to someone in your network"
        uncompletedText="Reach out to someone in your network"
        handleChange={() =>
          dispatch({
            type: ONBOARDING_STEP_COMPLETED,
            payload: {
              userId: uid,
              onboardingStep: 'reachOut',
              checked: onboarding && onboarding.reachOut,
            },
          })
        }
      />

      <Step
        value="helpedSomeone"
        completed={onboarding && onboarding.helpedSomeone}
        disabled
        completedText="Help someone in your network"
        uncompletedText="Help someone in your network"
      />
    </>
  );
};

GettingStarted.propTypes = startingPropTypes;
GettingStarted.defaultProps = startingDefaultProps;

const Step = ({
  value,
  completed,
  disabled,
  uid,
  completedText,
  uncompletedText,
  handleChange,
  href,
}) => (
  <div className="flex items-center mb2">
    <label htmlFor="signup" className="lh-copy">
      <input
        className="mr2"
        type="checkbox"
        id={value}
        value={value}
        checked={completed}
        disabled={disabled}
        onChange={handleChange}
      />

      {completed ? (
        <small className="strike">{completedText}</small>
      ) : (
        <IncompleteText
          href={href}
          uid={uid}
          uncompletedText={uncompletedText}
        />
      )}
    </label>
  </div>
);

Step.propTypes = {
  value: PropTypes.string.isRequired,
  completed: PropTypes.bool,
  disabled: PropTypes.bool,
  uid: PropTypes.string,
  completedText: PropTypes.string.isRequired,
  uncompletedText: PropTypes.string,
  handleChange: PropTypes.func,
  href: PropTypes.string,
};

Step.defaultProps = {
  completed: true,
  uncompletedText: '',
  uid: undefined,
  disabled: false,
  handleChange: () => {},
  href: undefined,
};

const IncompleteText = ({ href, uid, uncompletedText }) =>
  href ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <small>{uncompletedText}</small>
    </a>
  ) : (
    <Link to={`/user/${uid}/profile`} className="f6 link dim mr3 mr4-ns">
      <small>{uncompletedText}</small>
    </Link>
  );

IncompleteText.propTypes = {
  uid: PropTypes.string,
  uncompletedText: PropTypes.string,
  href: PropTypes.string,
};
IncompleteText.defaultProps = {
  uncompletedText: '',
  uid: undefined,
  href: undefined,
};
