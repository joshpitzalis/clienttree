import React from 'react';
import PropTypes from 'prop-types';
import produce from 'immer';
import { Redirect, Link } from 'react-router-dom';
import { Subject } from 'rxjs';
import { tap, debounceTime } from 'rxjs/operators';
import { useDispatch } from 'react-redux';
import {
  handleFirebaseUpdate,
  fetchUserData,
  handleFirebaseDelete,
} from './serviceAPI';
import { toast$ } from '../notifications/toast';
import { ONBOARDING_STEP_COMPLETED } from '../onboarding/onboardingConstants';

export const serviceFormUpdate$ = new Subject();

export const curriedReducer = produce((draft, action) => {
  if (action.type === 'SERVICE_ADDED') {
    const newId = +new Date();
    const newIdString = newId.toString();

    draft[newIdString] = {
      id: newIdString,
      order: Object.values(draft).length ? Object.values(draft).length : 0,
      name: '',
      description: '',
      price: '',
      link: '',
    };
  }

  if (action.type === 'SERVICE_NAME_CHANGED') {
    draft[action.payload.serviceId].name = action.payload.value;
  }

  if (action.type === 'SERVICE_DESCRIPTION_CHANGED') {
    draft[action.payload.serviceId].description = action.payload.value;
  }

  if (action.type === 'SERVICE_PRICE_CHANGED') {
    draft[action.payload.serviceId].price = action.payload.value;
  }

  if (action.type === 'SERVICE_LINK_CHANGED') {
    draft[action.payload.serviceId].link = action.payload.value;
  }

  if (action.type === 'HYDRATE_SERVICES') {
    return action.payload;
  }

  if (action.type === 'SERVICE_DELETED') {
    delete draft[action.payload.serviceId];
  }
});

const propTypes = {
  uid: PropTypes.string.isRequired,
};
const defaultProps = {};

const Services = props => {
  const { uid } = props;
  const [state, dispatch] = React.useReducer(curriedReducer, {});
  const [firstTime] = React.useState(false);
  const reduxDispatch = useDispatch();

  React.useEffect(() => {
    if (uid) {
      fetchUserData(uid)
        .then(data =>
          dispatch({
            type: 'HYDRATE_SERVICES',
            payload: data && data.services && data.services,
          })
        )
        .catch(error =>
          toast$.next({ type: 'ERROR', message: error.message || error })
        );
    }
  }, [uid]);

  React.useEffect(() => {
    const updates = serviceFormUpdate$
      .pipe(
        debounceTime(1000),
        tap(({ type, payload }) => {
          if (type === 'SERVICES_DELETED') {
            const { userId, id } = payload;
            handleFirebaseDelete({ id, userId });
            return;
          }

          handleFirebaseUpdate(payload)
            .then(() => {
              // track event in amplitude
              const { analytics } = window;
              analytics.track('Services Updated');
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
          className="measure mt5"
          onSubmit={e => {
            e.preventDefault();

            dispatch({
              type: 'SERVICE_ADDED',
            });
            reduxDispatch({
              type: ONBOARDING_STEP_COMPLETED,
              payload: { userId: uid, onboardingStep: 'referralPageCreated' },
            });
          }}
        >
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f4 fw6 ph0 mh0" data-testid="services">
              Services
            </legend>

            <p className=" black-60 ">
              A little introduction to what productizing services even means.
            </p>

            <br />
            <Link className="blue db mb5" to={`/refer/${uid}`}>
              Go To Your Public Referral Page
            </Link>
          </fieldset>

          {state &&
            Object.values(state)
              .sort((a, b) => a.order - b.order)
              .map(service => (
                <IndividualService
                  {...service}
                  dispatch={dispatch}
                  key={service.id}
                  userId={uid}
                />
              ))}

          <div className="mt3">
            <input
              className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
              type="submit"
              value="+ Add a service"
              data-testid="addService"
            />
          </div>
        </form>
      </main>
    </div>
  );
};

Services.propTypes = propTypes;
Services.defaultProps = defaultProps;

export default Services;

const sericePropTypes = {
  dispatch: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};

const serviceDefaultProps = {};

const IndividualService = ({
  dispatch,
  id,
  name,
  description,
  price,
  link,
  userId,
}) => (
  <div className="mb5 pt4 bt b--light-gray" data-testid="serviceBox">
    <div className="mb4">
      <label className="db fw6 lh-copy f6" htmlFor="serviceName">
        Service Name
        <input
          className="mt1 db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb2"
          type="text"
          name="serviceName"
          id="serviceName"
          placeholder="What should people ask for?"
          value={name}
          onChange={e => {
            dispatch({
              type: 'SERVICE_NAME_CHANGED',
              payload: {
                serviceId: id,
                value: e.target.value,
              },
            });
            serviceFormUpdate$.next({
              type: 'SERVICES_FORM_UPDATED',
              payload: {
                userId,
                id,
                name: e.target.value,
                description,
                price,
                link,
              },
            });
          }}
        />
      </label>
    </div>

    <div className="mb4">
      <label htmlFor="comment" className="f6 b db mb2">
        Service Description
        <textarea
          rows="10"
          id="comment"
          name="comment"
          className="mt1 db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb2"
          aria-describedby="comment-desc"
          placeholder="What do people get?"
          value={description}
          onChange={e => {
            dispatch({
              type: 'SERVICE_DESCRIPTION_CHANGED',
              payload: {
                serviceId: id,
                value: e.target.value,
              },
            });
            serviceFormUpdate$.next({
              type: 'SERVICES_FORM_UPDATED',
              payload: {
                userId,
                id,
                name,
                description: e.target.value,
                price,
                link,
              },
            });
          }}
        ></textarea>
      </label>
      {/* tk */}
      {/* <small id="comment-desc" className="f6 black-60">
          If you have never thought about who your ideal clients are here is{' '}
          <a className="blue dib underline">a useful article</a> to help get you
          in the right mindet.
        </small> */}
    </div>

    <div className="mb4">
      <label htmlFor="comment" className="f6 b db mb2">
        Price & Duration
        <textarea
          rows="5"
          id="comment"
          name="comment"
          className="mt1 db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb2"
          aria-describedby="comment-desc"
          value={price}
          placeholder="How much?"
          onChange={e => {
            dispatch({
              type: 'SERVICE_PRICE_CHANGED',
              payload: {
                serviceId: id,
                value: e.target.value,
              },
            });
            serviceFormUpdate$.next({
              type: 'SERVICES_FORM_UPDATED',
              payload: {
                userId,
                id,
                name,
                description,
                price: e.target.value,
                link,
              },
            });
          }}
        ></textarea>
      </label>
      {/* tk */}
      {/* <small id="comment-desc" className="f6 black-60">
          If you have never thought about who your ideal clients are here is{' '}
          <a className="blue dib underline">a useful article</a> to help get you
          in the right mindet.
        </small> */}
    </div>

    <div className="mt3 mb4">
      <label className="db fw6 lh-copy f6" htmlFor="email-address">
        Link
        <input
          className="mt1 db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb2"
          type="text"
          name="email-address"
          id="email-address"
          placeholder="How do I find out more?"
          value={link}
          onChange={e => {
            dispatch({
              type: 'SERVICE_LINK_CHANGED',
              payload: {
                serviceId: id,
                value: e.target.value,
              },
            });
            serviceFormUpdate$.next({
              type: 'SERVICES_FORM_UPDATED',
              payload: {
                userId,
                id,
                name,
                description,
                price,
                link: e.target.value,
              },
            });
          }}
        />
      </label>
    </div>
    <ConfirmDelete
      handleDelete={() => {
        serviceFormUpdate$.next({
          type: 'SERVICES_DELETED',
          payload: {
            userId,
            id,
          },
        });
        dispatch({
          type: 'SERVICE_DELETED',
          payload: {
            serviceId: id,
          },
        });
      }}
      title={name}
    />
  </div>
);

IndividualService.propTypes = sericePropTypes;
IndividualService.defaultProps = serviceDefaultProps;

const confirmDeletePropTypes = {
  handleDelete: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
const confirmDeleteDefaultProps = {};

export const ConfirmDelete = ({ handleDelete, title }) => {
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  return (
    <div>
      {confirmDelete ? (
        <div>
          <small className="f6 black-70 small-caps">
            Are you sure you want to delete this service?
          </small>
          <div className="mv3">
            <button
              className="f6 red small-caps pointer link dim ba bw1 ph3 pv2 mb2 dib b--red"
              type="button"
              onClick={handleDelete}
            >
              {`Delete ${title}`}
            </button>
            <button
              className="f6 small-caps bn pointer ml3 black-70"
              type="button"
              onClick={() => setConfirmDelete(false)}
            >
              Nevermind
            </button>
          </div>
        </div>
      ) : (
        <button
          className="f6 red small-caps bn pointer"
          type="button"
          onClick={() => setConfirmDelete(true)}
        >
          {`Delete ${title}`}
        </button>
      )}
    </div>
  );
};

ConfirmDelete.propTypes = confirmDeletePropTypes;
ConfirmDelete.defaultProps = confirmDeleteDefaultProps;
