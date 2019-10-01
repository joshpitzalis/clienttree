import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, Link, Route, Redirect } from 'react-router-dom';
import produce from 'immer';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import { Subject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { PrivateRoute } from '../PrivateRoute';
// history: ReactRouterPropTypes.history.isRequired,
// location: ReactRouterPropTypes.location.isRequired,
// match: ReactRouterPropTypes.match.isRequired,
// route: ReactRouterPropTypes.route.isRequired,

export const confetti$ = new Subject();

const useConfetti = confettiStream$ => {
  const [pour, setPour] = React.useState('');

  React.useEffect(() => {
    const messages = confettiStream$
      .pipe(
        tap(() => setPour(true)),
        delay(10000),
        tap(() => setPour(false))
      )
      .subscribe();

    return () => messages.unsubscribe();
  }, [confettiStream$]);

  return [pour];
};

const ConfettiBanner = ({ setWelcomeMessage }) => {
  const [pour] = useConfetti(confetti$);
  const { width, height } = useWindowSize();

  return (
    pour && (
      <Confetti
        width={width}
        height={height}
        numberOfPieces={500}
        recycle={false}
        onConfettiComplete={() =>
          setWelcomeMessage({
            header: 'Nice!',
            byline: 'Try adding your signature to your email account next.',
          })
        }
      />
    )
  );
};

const dashPropTypes = {
  welcomeMessage: PropTypes.string.isRequired,
};

const dashDefaultProps = {};

function Dash({ welcomeMessage }) {
  return (
    <div>
      <h1 className="mt0 tc">{welcomeMessage.header}</h1>
      <h3 className="mt0 tc gray">{welcomeMessage.byline}</h3>
      <ul className="list pl0">
        <li className="pa3 pa4-ns bb b--black-10">
          <b className="db f3 mb1">Interested</b>
          <img
            alt="client face"
            src="http://mrmrs.github.io/photos/p/2.jpg"
            className="dib ba b--black-10 db br-100 w2 w3-ns h2 h3-ns mv3 mr3 pointer "
          />
        </li>
        <li className="pa3 pa4-ns bb b--black-10">
          <b className="db f3 mb1">Contacted</b>
          <small className="f5 db lh-copy measure o-50">
            Ipsum lorem, perhaps put an optional little description here, thingy
            thingy, maybe, not sure yet...
          </small>
        </li>
        <li className="pa3 pa4-ns bb b--black-10">
          <b className="db f3 mb1">Brief Established</b>
          <small className="f5 db lh-copy measure o-50">
            Ipsum lorem, perhaps put an optional little description here, thingy
            thingy, maybe, not sure yet...
          </small>
        </li>
        <li className="pa3 pa4-ns bb b--black-10">
          <b className="db f3 mb1">Invoice Sent</b>
          <small className="f5 db lh-copy measure o-50">
            Ipsum lorem, perhaps put an optional little description here, thingy
            thingy, maybe, not sure yet...
          </small>
        </li>
        <li className="pa3 pa4-ns bb b--black-10">
          <b className="db f3 mb1">Proposal Sent</b>
          <small className="f5 db lh-copy measure o-50">
            Ipsum lorem, perhaps put an optional little description here, thingy
            thingy, maybe, not sure yet...
          </small>
        </li>
        <li className="pa3 pa4-ns bb b--black-10">
          <b className="db f3 mb1">Project Started</b>
          <small className="f5 db lh-copy measure o-50">
            Ipsum lorem, perhaps put an optional little description here, thingy
            thingy, maybe, not sure yet...
          </small>
        </li>
        <li className="pa3 pa4-ns bb b--black-10">
          <b className="db f3 mb1">Handover Complete</b>
          <small className="f5 db lh-copy measure o-50">
            Ipsum lorem, perhaps put an optional little description here, thingy
            thingy, maybe, not sure yet...
          </small>
        </li>
        <li className="pa3 pa4-ns">
          <b className="db f3 mb1">Testimonial Received</b>
          <small className="f5 db lh-copy measure o-50">
            Ipsum lorem, perhaps put an optional little description here, thingy
            thingy, maybe, not sure yet...
          </small>
        </li>
      </ul>
    </div>
  );
}

Dash.propTypes = dashPropTypes;
Dash.defaultProps = dashDefaultProps;

const reducerFunction = (state, action) => {
  if (action.type === 'NAME_CHANGED') {
    return produce(state, draft => {
      draft.name = action.payload;
    });
  }

  if (action.type === 'DESIGNATION_CHANGED') {
    return produce(state, draft => {
      draft.designation = action.payload;
    });
  }

  if (action.type === 'WEBSITE_CHANGED') {
    return produce(state, draft => {
      draft.website = action.payload;
    });
  }

  if (action.type === 'CLIENT_CHANGED') {
    return produce(state, draft => {
      draft.client = action.payload;
    });
  }

  if (action.type === 'SERVICE_CHANGED') {
    return produce(state, draft => {
      draft.service = action.payload;
    });
  }

  if (action.type === 'FORM_SUBMITTED') {
    return produce(state, draft => {
      draft.submitted = true;
    });
  }
};
const initialState = {
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

function Profile(props) {
  const { setSubmitted, submitted } = props;
  const [state, dispatch] = React.useReducer(reducerFunction, initialState);
  const [firstTime, completeFirstTime] = React.useState(false);
  if (firstTime) return <Redirect to="/user/123/dashboard" />;
  return (
    <div>
      <main className="pa4 pl0 pt0 black-80">
        <div className=" pv4  " style={sticky}>
          <article className="mw5 mw6-ns hidden ba b--light-gray mb3 br3 bg-white">
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
                <a className={`blue dib underline ${!state.website && 'o-20'}`}>
                  Please Refer Me
                </a>
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

const networkPropTypes = {};

const networkDefaultProps = {};

function Network() {
  return <React.Fragment>Network</React.Fragment>;
}

Network.propTypes = networkPropTypes;
Network.defaultProps = networkDefaultProps;

const profilePropTypes = {};

const profileDefaultProps = {};

function MiniProfile() {
  return (
    <>
      <article className="mw5 center bg-white br3 pa3 pa4-ns mv3 ba b--black-10">
        <div className="tc">
          <img
            alt="profile"
            src="http://tachyons.io/img/avatar_1.jpg"
            className="br-100 h3 w3 dib"
            title="Photo of a kitty staring at you"
          />
          <h1 className="f4">Name</h1>
          <h2 className="f5 fw4 gray mt0">Freelance Something</h2>
          <hr className="mw3 bb bw1 b--black-10" />
        </div>
        <p className="lh-copy measure center f6 black-70 dib">
          Quite affectionate and outgoing. She loves to get chin scratches and
          will roll around on the floor waiting for you give her more of them ?{' '}
          <a className="blue dib"> Refer Me</a>
        </p>
      </article>
    </>
  );
}

MiniProfile.propTypes = profilePropTypes;
MiniProfile.defaultProps = profileDefaultProps;

export function Dashboard() {
  const [submitted, setSubmitted] = React.useState(false);
  const [welcomeMessage, setWelcomeMessage] = React.useState({
    header: 'Welcome!',
    byline: '',
  });
  console.log({ setWelcomeMessage });

  return (
    <div className="flex">
      <ConfettiBanner setWelcomeMessage={setWelcomeMessage} />
      <div className="w-25">
        <ul className="flex-col">
          <li className="list">
            <NavLink
              to="/user/123/profile"
              activeClassName="b underline"
              className="f6 link dim mr3 mr4-ns"
            >
              Profile
            </NavLink>
          </li>
          <li className="list mt3">
            <NavLink
              activeClassName="b underline"
              to="/user/123/dashboard"
              className="f6 link dim mr3 mr4-ns "
            >
              Dashboard
            </NavLink>
          </li>
          <li className="list mt3">
            <NavLink
              activeClassName="b underline"
              to="/user/123/network"
              className="f6 link dim mr3 mr4-ns "
            >
              Network
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="w-50">
        <PrivateRoute exact path="/user/:uid/" component={Dash} />

        <Route
          exact
          path="/user/:uid/dashboard"
          render={props => <Dash {...props} welcomeMessage={welcomeMessage} />}
        />
        <Route
          exact
          path="/user/:uid/profile"
          render={props => (
            <Profile
              {...props}
              setSubmitted={setSubmitted}
              submitted={submitted}
            />
          )}
        />
        <PrivateRoute exact path="/user/:uid/network" component={Network} />
      </div>
      <div className="w-25">
        <form className="pa4">
          <fieldset id="favorite_movies" className="bn">
            <legend className="fw7 mb2">Getting Started 1/3</legend>
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
                  <span className="strike">Create an email signature</span>
                ) : (
                  <Link
                    to="/user/123/profile"
                    className="f6 link dim mr3 mr4-ns"
                  >
                    Create an email signature
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
                  Add the signature to your email
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
                <span className="">Add someone to your network</span>
              </label>
            </div>
          </fieldset>
        </form>
        {/* <PrivateRoute exact path="/user/:uid/profile" component={MiniProfile} /> */}
      </div>
    </div>
  );
}
