import React from 'react';
import PropTypes from 'prop-types';
import produce from 'immer';
import { Redirect } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import { tap, debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import Portal from '../../utils/Portal';
import Plus from '../../images/Plus';
import { confetti$ } from '../onboarding/confetti';
import {
  handleFirebaseProfileUpdate,
  fetchUserData,
} from '../services/serviceAPI';
import { toast$ } from '../notifications/toast';

export const personFormUpdate$ = new Subject();

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
    const { name, designation, website, clients, service } = action.payload;
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

const networkPropTypes = {
  uid: PropTypes.string.isRequired,
};
const networkDefaultProps = {};

export function Network({ uid }) {
  const [visible, setVisibility] = React.useState(false);
  const [state, dispatch] = React.useReducer(curriedReducer, initialState);

  return (
    <>
      {visible && (
        <Portal onClose={() => setVisibility(false)}>
          <Modal setVisibility={setVisibility} uid={uid} />
        </Portal>
      )}
      <div className="flex items-center lh-copy pa3 ph0-l bb b--black-10 ">
        <button
          className=" flex items-center pointer link bn"
          type="button"
          onClick={() => setVisibility(true)}
        >
          <Plus className="black-70" />
          <div className="pl2 ">
            <span className="f6 db black-70">Add someone to your network</span>
            {/* <span className="f6 db black-70">
            Bulk Import contacts from Gmail
          </span> */}
          </div>
        </button>
      </div>
      <ul className="list pl0 mt0  ">
        <li className="flex items-center lh-copy pa3 ph0-l bb b--black-10">
          <img
            alt=""
            className="w2 h2 w3-ns h3-ns br-100"
            src="http://tachyons.io/img/avatar-mrmrs.jpg"
          />
          <div className="pl3 flex-auto">
            <span className="f6 db black-70">Mrmrs</span>
            <span className="f6 db black-70">Medium Hexagon, LLC</span>
          </div>
          <div>
            <a href="tel:" className="f6 link blue hover-dark-gray">
              +1 (999) 555-5555
            </a>
          </div>
        </li>
        <li className="flex items-center lh-copy pa3 ph0-l bb b--black-10">
          <img
            alt=""
            className="w2 h2 w3-ns h3-ns br-100"
            src="http://tachyons.io/img/avatar-jxnblk.jpg"
          />
          <div className="pl3 flex-auto">
            <span className="f6 db black-70">Jxnblk</span>
            <span className="f6 db black-70">Large Circle, Inc</span>
          </div>
          <div>
            <a href="tel:" className="f6 link blue hover-dark-gray">
              +1 (999) 555-5555
            </a>
          </div>
        </li>
        <li className="flex items-center lh-copy pa3 ph0-l bb b--black-10">
          <img
            alt=""
            className="w2 h2 w3-ns h3-ns br-100"
            src="http://tachyons.io/img/avatar-jasonli.jpg"
          />
          <div className="pl3 flex-auto">
            <span className="f6 db black-70">Jason Li</span>
            <span className="f6 db black-70">Little Blue Square, Inc</span>
          </div>
          <div>
            <a href="tel:" className="f6 link blue hover-dark-gray">
              +1 (999) 555-5555
            </a>
          </div>
        </li>
        <li className="flex items-center lh-copy pa3 ph0-l bb b--black-10">
          <img
            alt=""
            className="w2 h2 w3-ns h3-ns br-100"
            src="http://tachyons.io/img/avatar-yavor.jpg"
          />
          <div className="pl3 flex-auto">
            <span className="f6 db black-70">Yavor</span>
            <span className="f6 db black-70">Large Circle, Inc</span>
          </div>
          <div>
            <a href="tel:" className="f6 link blue hover-dark-gray">
              +1 (999) 555-5555
            </a>
          </div>
        </li>
      </ul>
    </>
  );
}
Network.propTypes = networkPropTypes;
Network.defaultProps = networkDefaultProps;

const modalPropTypes = {
  setVisibility: PropTypes.func.isRequired,
  uid: PropTypes.string.isRequired,
};
const modalDefaultProps = {};

function Modal({ setVisibility, uid }) {
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
    const updates = personFormUpdate$
      .pipe(
        debounceTime(1000),
        tap(({ payload }) => {
          handleFirebaseProfileUpdate(payload).catch(error =>
            toast$.next({ type: 'ERROR', message: error.message || error })
          );
        })
      )
      .subscribe();
    return () => updates.unsubscribe();
  }, []);

  return (
    <form
      className="measure "
      onSubmit={e => {
        e.preventDefault();
        // tk validity check goes here

        dispatch({
          type: 'FORM_SUBMITTED',
        });
      }}
    >
      <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
        <legend className="f4 fw6 ph0 mh0">Profile</legend>
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
                personFormUpdate$.next({
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

                personFormUpdate$.next({
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

                personFormUpdate$.next({
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

        <div className="mb4">
          <label htmlFor="comment" className="f6 b db mb2">
            How do you help them?
            <textarea
              id="comment"
              name="comment"
              className="db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb2"
              aria-describedby="comment-desc"
              placeholder="The thing I help with..."
              value={state.service}
              onChange={e => {
                dispatch({
                  type: 'SERVICE_CHANGED',
                  payload: e.target.value,
                });
                const { name, designation, website, clients } = state;

                personFormUpdate$.next({
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
  );
}

Modal.propTypes = modalPropTypes;
Modal.defaultProps = modalDefaultProps;
