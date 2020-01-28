import React from 'react';
import PropTypes from 'prop-types';
import produce from 'immer';
import { Redirect } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import { tap, debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { useDispatch, useSelector } from 'react-redux';
import { confetti$ } from '../onboarding/confetti';
import Services from './Services';
import { handleFirebaseProfileUpdate, fetchUserData } from './serviceAPI';
import { toast$ } from '../notifications/toast';
import { ONBOARDING_STEP_COMPLETED } from '../onboarding/onboardingConstants';

export const profileFormUpdate$ = new Subject();

export const curriedReducer = produce((draft, action) => {
  if (action.type === 'NAME_CHANGED') {
    draft.name = action.payload;
  }

  if (action.type === 'DESIGNATION_CHANGED') {
    draft.designation = action.payload;
  }

  if (action.type === 'WEBSITE_CHANGED') {
    draft.website = action.payload;
  }

  if (action.type === 'CLIENT_CHANGED') {
    draft.clients = action.payload;
  }

  if (action.type === 'SERVICE_CHANGED') {
    draft.service = action.payload;
  }

  if (action.type === 'FORM_SUBMITTED') {
    draft.submitted = true;
  }

  if (action.type === 'HYDRATE_PROFILE') {
    const {
      name = '',
      designation = '',
      website = '',
      clients = '',
      service = '',
    } = action.payload;
    draft.name = name;
    draft.designation = designation;
    draft.website = website;
    draft.clients = clients;
    draft.service = service;
  }
});

export const initialState = {
  name: '',
  designation: '',
  website: '',
  clients: '',
  service: '',
  submitted: false,
};

const propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};
const defaultProps = {};

export function Profile(props) {
  const reduxDispatch = useDispatch();
  const onboarded = useSelector(
    store =>
      store.user &&
      store.user.onboarding &&
      store.user.onboarding.signatureCreated
  );
  const {
    match: {
      params: { uid },
    },
  } = props;

  const [state, dispatch] = React.useReducer(curriedReducer, initialState);
  const [firstTime, completeFirstTime] = React.useState(false);

  React.useEffect(() => {
    if (uid) {
      fetchUserData(uid)
        .then(data => {
          if (data) {
            dispatch({
              type: 'HYDRATE_PROFILE',
              payload: data,
            });
          }
        })
        .catch(error =>
          toast$.next({ type: 'ERROR', message: error.message || error })
        );
    }
  }, [uid]);

  React.useEffect(() => {
    const updates = profileFormUpdate$
      .pipe(
        debounceTime(1000),
        tap(({ payload }) => {
          handleFirebaseProfileUpdate(payload)
            .then(() => {
              // track event in amplitude
              const { analytics } = window;
              return analytics && analytics.track('Profile Updated');
            })
            .catch(error =>
              toast$.next({ type: 'ERROR', message: error.message || error })
            );
        })
      )
      .subscribe();
    return () => updates.unsubscribe();
  }, []);

  if (firstTime) return <Redirect to={`/user/${uid}/dashboard`} />;

  return (
    <div>
      <main className="pa4 pl0 pt0 black-80">
        <form
          className="measure "
          onSubmit={e => {
            e.preventDefault();
            // tk validity check goes here

            if (!onboarded) {
              reduxDispatch({
                type: ONBOARDING_STEP_COMPLETED,
                payload: { userId: uid, onboardingStep: 'signatureCreated' },
              });

              completeFirstTime(true);
              window.scrollTo(0, 0);
              confetti$.next();
              dispatch({
                type: 'FORM_SUBMITTED',
              });
            }
          }}
        >
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f4 fw6 ph0 mh0 pt4" data-testid="profileHeader">
              Profile
            </legend>
            <div className="mt3 mb4">
              <label className="db fw6 lh-copy f6" htmlFor="name">
                Your Name
                <input
                  className="db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb2"
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Your name..."
                  value={state.name}
                  onChange={e => {
                    const { designation, website, clients, service } = state;
                    dispatch({
                      type: 'NAME_CHANGED',
                      payload: e.target.value,
                    });
                    profileFormUpdate$.next({
                      type: 'PROFILE_FORM_UPDATED',
                      payload: {
                        userId: uid,
                        name: e.target.value,
                        designation,
                        website,
                        clients,
                        service,
                      },
                    });
                  }}
                />
              </label>
            </div>
            <div className=" mb4">
              <label className="db fw6 lh-copy f6" htmlFor="designation">
                Designation
                <input
                  className="db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb2"
                  type="text"
                  name="designation"
                  id="designation"
                  placeholder="Professional Pickle Peeler"
                  value={state.designation}
                  onChange={e => {
                    dispatch({
                      type: 'DESIGNATION_CHANGED',
                      payload: e.target.value,
                    });
                    const { name, website, clients, service } = state;

                    profileFormUpdate$.next({
                      type: 'DESIGNATION_CHANGED',
                      payload: {
                        userId: uid,
                        name,
                        designation: e.target.value,
                        website,
                        clients,
                        service,
                      },
                    });
                  }}
                />
              </label>
            </div>

            <div className=" mb5">
              <label className="db fw6 lh-copy f6" htmlFor="website">
                Website URL
                <input
                  className="db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb2"
                  type="text"
                  name="website"
                  id="website"
                  placeholder="www.something.com"
                  value={state.website}
                  onChange={e => {
                    dispatch({
                      type: 'WEBSITE_CHANGED',
                      payload: e.target.value,
                    });

                    const { name, designation, clients, service } = state;

                    profileFormUpdate$.next({
                      type: 'WEBSITE_CHANGED',
                      payload: {
                        userId: uid,
                        name,
                        designation,
                        website: e.target.value,
                        clients,
                        service,
                      },
                    });
                  }}
                />
              </label>
            </div>

            <div className=" mb5">
              <label htmlFor="comment" className="f6 b db mb2">
                Who are your ideal clients?
                <textarea
                  id="comment"
                  name="comment"
                  className="db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb2"
                  aria-describedby="comment-desc"
                  placeholder="My ideal clients..."
                  value={state.clients}
                  onChange={e => {
                    dispatch({
                      type: 'CLIENT_CHANGED',
                      payload: e.target.value,
                    });

                    const { name, designation, website, service } = state;

                    profileFormUpdate$.next({
                      type: 'CLIENT_CHANGED',
                      payload: {
                        userId: uid,
                        name,
                        designation,
                        website,
                        clients: e.target.value,
                        service,
                      },
                    });
                  }}
                ></textarea>
              </label>
              {/* tk */}
              {/* <small id="comment-desc" className="f6 black-60">
                If you have never thought about who your ideal clients are here
                is <a className="blue dib underline">a useful article</a> to
                help get you in the right mindet.
              </small> */}
            </div>

            <div className="mb4">
              <label htmlFor="helpThem" className="f6 b db mb2">
                How do you help them?
                <textarea
                  id="helpThem"
                  name="helpThem"
                  className="db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb2"
                  aria-describedby="helpThem"
                  placeholder="The thing I help with..."
                  value={state.service}
                  onChange={e => {
                    dispatch({
                      type: 'SERVICE_CHANGED',
                      payload: e.target.value,
                    });
                    const { name, designation, website, clients } = state;

                    profileFormUpdate$.next({
                      type: 'SERVICE_CHANGED',
                      payload: {
                        userId: uid,
                        name,
                        designation,
                        website,
                        clients,
                        service: e.target.value,
                      },
                    });
                  }}
                ></textarea>
              </label>
              {/* tk */}
              {/* <small id="comment-desc" className="f6 black-60">
                If you don't have a specialisation{' '}
                <a className="blue dib underline">I recommend this article</a>{' '}
                to help you start thinking about focusing in on what youd on
                best.
              </small> */}
            </div>
          </fieldset>
          <div className="mt3">
            <input
              className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
              type="submit"
              value="Save"
            />
          </div>
        </form>
        <SignatureCard state={state} />
        <Services uid={uid} />
      </main>
    </div>
  );
}
Profile.propTypes = propTypes;
Profile.defaultProps = defaultProps;

const sigPropTypes = {
  state: PropTypes.shape({
    name: PropTypes.string.isRequired,
    designation: PropTypes.string.isRequired,
    website: PropTypes.string.isRequired,
    clients: PropTypes.string.isRequired,
    service: PropTypes.string.isRequired,
  }).isRequired,
};
const sigDefaultProps = {};

const SignatureCard = ({ state }) => (
  <div className=" pv4" data-testid="signatureCard">
    <article className="mw5 mw6-ns hidden ba b--light-gray mb3 br3 bg-near-white">
      <div className="pa3 ">
        <h1 className="f4 gray">{state.name || 'Your Name'}</h1>
        <h2 className="f5 fw4 gray mt0 i">
          {state.designation || 'Your Designation'}
        </h2>

        <p className="lh-copy measure center f6 gray dib">
          Do you know any{' '}
          <span className={!state.clients && 'b'}>
            {state.clients || 'of my ideal clients'}
          </span>{' '}
          that need help with{' '}
          <span className={!state.service && 'b'}>
            {state.service || 'the thing I help with'}
          </span>{' '}
          ?{' '}
          {state.website ? (
            <a className="blue dib underline">Please Refer Me</a>
          ) : (
            <small className="dib">Please Refer Me</small>
          )}
        </p>
      </div>
    </article>
    {/* tk */}
    {/* <small className="pt4 f6 black-60 mb4 pt3 tc blue underline o-50 i">
        How to use this as your email signature.
      </small> */}
  </div>
);

SignatureCard.propTypes = sigPropTypes;
SignatureCard.defaultProps = sigDefaultProps;
