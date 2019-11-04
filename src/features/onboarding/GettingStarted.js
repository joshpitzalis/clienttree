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
      <div className="flex items-center mb2">
        <label htmlFor="signup" className="lh-copy">
          <input
            className="mr2"
            type="checkbox"
            id="signup"
            value="signup"
            checked
            onChange={() => {}}
          />
          <small className="strike">Sign up to Client Tree</small>
        </label>
      </div>

      <div className="flex items-center mb2">
        <label htmlFor="signature" className="lh-copy">
          <input
            className="mr2"
            type="checkbox"
            id="signature"
            value="signature"
            disabled
            checked={onboarding && onboarding.signatureCreated}
          />
          {onboarding && onboarding.signatureCreated ? (
            <small className="strike">
              Completed your profile and created a referrable email signature.
            </small>
          ) : (
            <Link
              to={`/user/${uid}/profile`}
              className="f6 link dim mr3 mr4-ns"
            >
              <small>
                Complete your profile to create a referrable email signature.
              </small>
            </Link>
          )}
        </label>
      </div>
      <div className="flex items-center mb2">
        <label htmlFor="email" className="lh-copy">
          <input
            className="mr2 "
            type="checkbox"
            id="email"
            value="email"
            checked={onboarding && onboarding.addedSignatureToEmail}
            onChange={() =>
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

          {onboarding && onboarding.addedSignatureToEmail ? (
            <small className="strike">
              Actually add the signature to your email account
            </small>
          ) : (
            <small>
              <a
                href="https://support.google.com/mail/answer/8395?co=GENIE.Platform%3DDesktop&hl=en"
                target="_blank"
                rel="noopener noreferrer"
              >
                Actually add the signature to your email account
              </a>
            </small>
          )}
        </label>
      </div>
      <div className="flex items-center mb2">
        <label htmlFor="referral" className="lh-copy">
          <input
            className="mr2"
            type="checkbox"
            id="referral"
            value="referral"
            disabled
            checked={onboarding && onboarding.referralPageCreated}
          />
          {onboarding && onboarding.referralPageCreated ? (
            <small className="strike">
              Add services to your profile to create a referral page
            </small>
          ) : (
            <small>
              Add services to your profile to create a referral page
            </small>
          )}
        </label>
      </div>
      <div className="flex items-center mb2">
        <label htmlFor="addedSomeone" className="lh-copy">
          <input
            className="mr2"
            type="checkbox"
            id="addedSomeone"
            value="addedSomeone"
            disabled
            checked={onboarding && onboarding.addedSomeone}
          />
          {onboarding && onboarding.addedSomeone ? (
            <small className="strike">
              Add someone to your professional network
            </small>
          ) : (
            <small className="">Add someone to your professional network</small>
          )}
        </label>
      </div>
      <div className="flex items-center mb2">
        <label htmlFor="reachOut" className="lh-copy">
          <input
            className="mr2"
            type="checkbox"
            id="reachOut"
            value="reachOut"
            checked={onboarding && onboarding.reachOut}
            onChange={() =>
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
          {onboarding && onboarding.reachOut ? (
            <small className="strike">
              Reach out to someone in your network
            </small>
          ) : (
            <small className="">Reach out to someone in your network</small>
          )}
        </label>
      </div>
      <div className="flex items-center mb2">
        <label htmlFor="helpedSomeone" className="lh-copy">
          <input
            className="mr2"
            type="checkbox"
            id="helpedSomeone"
            value="helpedSomeone"
            disabled
            checked={onboarding && onboarding.helpedSomeone}
          />
          {onboarding && onboarding.helpedSomeone ? (
            <small className="strike">Help someone in your network</small>
          ) : (
            <small className="">Help someone in your network</small>
          )}
        </label>
      </div>
    </>
  );
};

GettingStarted.propTypes = startingPropTypes;
GettingStarted.defaultProps = startingDefaultProps;
