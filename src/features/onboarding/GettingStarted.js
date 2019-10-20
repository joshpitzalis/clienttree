import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { ONBOARDING_STEP_COMPLETED } from './onboardingConstants';

const startingPropTypes = {
  uid: PropTypes.string,
};
const startingDefaultProps = {
  uid: '',
};

export const GettingStarted = ({ uid }) => {
  const dispatch = useDispatch();
  const onboarding = useSelector(
    store => store.user && store.user.onboarding && store.user.onboarding
  );

  React.useEffect(() => {
    const completeCount =
      onboarding && Object.values(onboarding).filter(x => true).length;
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
  if (onboarding && onboarding.complete === true) {
    // if all the onboarding staeps are complete there is no reason to show this module
    return null;
  }
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
            onChange={() => {}}
            checked={onboarding && onboarding.signatureCreated}
          />
          {onboarding && onboarding.signatureCreated ? (
            <small className="strike">
              Create an email signature that helps people refer you.
            </small>
          ) : (
            <Link
              to={`/user/${uid}/profile`}
              className="f6 link dim mr3 mr4-ns"
            >
              <small>
                Create an email signature that helps people refer you.
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
                },
              })
            }
          />

          {onboarding && onboarding.addedSignatureToEmail ? (
            <small className="strike">
              Actually add the signature to your email account
            </small>
          ) : (
            <small>Actually add the signature to your email account</small>
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
            checked={onboarding && onboarding.referralPageCreated}
          />
          {onboarding && onboarding.referralPageCreated ? (
            <small className="strike">Create a referral page</small>
          ) : (
            <small className="">Create a referral page</small>
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
