import React from 'react';
import PropTypes from 'prop-types';
import produce from 'immer';
import { Redirect } from 'react-router-dom';
import { confetti$ } from '../onboarding/confetti';

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
    draft.client = action.payload;
  }

  if (action.type === 'SERVICE_CHANGED') {
    draft.service = action.payload;
  }

  if (action.type === 'FORM_SUBMITTED') {
    draft.submitted = true;
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
  setSubmitted: PropTypes.func.isRequired,
  submitted: PropTypes.bool.isRequired,
};
const defaultProps = {};
const sticky = {
  position: 'sticky',
  top: 0,
  backgroundColor: 'rgba(255, 255, 255, .85)',
  backdropFilter: 'blur(2px)',
};
export function Profile(props) {
  const { setSubmitted, submitted } = props;
  const [state, dispatch] = React.useReducer(curriedReducer, initialState);
  const [firstTime, completeFirstTime] = React.useState(false);
  if (firstTime) return <Redirect to="/user/123/dashboard" />;
  return (
    <div>
      <main className="pa4 pl0 pt0 black-80">
        <div className=" pv4  " style={sticky}>
          <article className="mw5 mw6-ns hidden ba b--light-gray mb3 br3 bg-near-white">
            <div className="pa3 ">
              <h1 className="f4 gray">{state.name || 'Your Name'}</h1>
              <h2 className="f5 fw4 gray mt0 i">
                {state.designation || 'Your Designation'}
              </h2>

              <p className="lh-copy measure center f6 gray dib">
                Do you know any{' '}
                <span className={!state.client && 'b'}>
                  {state.client || 'of my ideal clients'}
                </span>{' '}
                that need help with{' '}
                <span className={!state.service && 'b'}>
                  {state.service || 'the thing I help with'}
                </span>
                ?{' '}
                {state.website && (
                  <a className="blue dib underline">Please Refer Me</a>
                )}
              </p>
            </div>
          </article>
          <small className="pt4 f6 black-60 mb4 pt3 tc blue underline o-50 i">
            How to use this as your email signature.
          </small>
        </div>

        <form
          className="measure mt5"
          onSubmit={e => {
            e.preventDefault();
            console.log({ submitted });
            // validity check goes here
            if (!submitted) {
              setSubmitted(true);
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
            <legend className="f4 fw6 ph0 mh0">Profile</legend>
            <div className="mt3 mb4">
              <label className="db fw6 lh-copy f6" htmlFor="email-address">
                Your Name
                <input
                  className="db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb2"
                  type="text"
                  name="email-address"
                  id="email-address"
                  placeholder="Your name..."
                  value={state.name}
                  onChange={e =>
                    dispatch({
                      type: 'NAME_CHANGED',
                      payload: e.target.value,
                    })
                  }
                />
              </label>
            </div>
            <div className=" mb4">
              <label className="db fw6 lh-copy f6" htmlFor="password">
                Designation
                <input
                  className="db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb2"
                  type="text"
                  name="password"
                  id="password"
                  placeholder="Professional Pickle Peeler"
                  value={state.designation}
                  onChange={e =>
                    dispatch({
                      type: 'DESIGNATION_CHANGED',
                      payload: e.target.value,
                    })
                  }
                />
              </label>
            </div>

            <div className=" mb5">
              <label className="db fw6 lh-copy f6" htmlFor="password">
                Website URL
                <input
                  className="db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb2"
                  type="text"
                  name="password"
                  id="password"
                  placeholder="www.something.com"
                  value={state.website}
                  onChange={e =>
                    dispatch({
                      type: 'WEBSITE_CHANGED',
                      payload: e.target.value,
                    })
                  }
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
                  onChange={e =>
                    dispatch({
                      type: 'CLIENT_CHANGED',
                      payload: e.target.value,
                    })
                  }
                ></textarea>
              </label>
              <small id="comment-desc" className="f6 black-60">
                If you have never thought about who your ideal clients are here
                is <a className="blue dib underline">a useful article</a> to
                help get you in the right mindet.
              </small>
            </div>

            <div className="mb4">
              <label htmlFor="comment" className="f6 b db mb2">
                How do you help them?
                <textarea
                  id="comment"
                  name="comment"
                  className="db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb2"
                  aria-describedby="comment-desc"
                  placeholder="The thing I help with..."
                  onChange={e =>
                    dispatch({
                      type: 'SERVICE_CHANGED',
                      payload: e.target.value,
                    })
                  }
                ></textarea>
              </label>
              <small id="comment-desc" className="f6 black-60">
                If you don't have a specialisation{' '}
                <a className="blue dib underline">I recommend this article</a>{' '}
                to help you start thinking about focusing in on what youd on
                best.
              </small>
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
      </main>
    </div>
  );
}
Profile.propTypes = propTypes;
Profile.defaultProps = defaultProps;
