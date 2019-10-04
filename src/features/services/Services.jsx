import React from 'react';
import PropTypes from 'prop-types';
import produce from 'immer';
import { Redirect, Link } from 'react-router-dom';
import { confetti$ } from '../onboarding/confetti';

export const curriedReducer = produce((draft, action) => {
  if (action.type === 'SERVICE_ADDED') {
    const newId = +new Date();
    draft.services[newId] = {
      id: newId,
      order: Object.values(draft.services).length,
      name: '',
      description: '',
      price: '',
      link: '',
    };
  }
});

export const initialState = {
  services: {
    123: {
      id: 123,
      order: 0,
      name: 'test',
      description: 'test',
      price: '23',
      link: 'www.sumsum.com',
    },
  },
};

const propTypes = {
  setSubmitted: PropTypes.func.isRequired,
  submitted: PropTypes.bool.isRequired,
  uid: PropTypes.string.isRequired,
};
const defaultProps = {};

export function Services(props) {
  const { setSubmitted, submitted, uid } = props;
  const [state, dispatch] = React.useReducer(curriedReducer, initialState);
  const [firstTime, completeFirstTime] = React.useState(false);
  if (firstTime) return <Redirect to="/user/123/dashboard" />;
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
          }}
        >
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f4 fw6 ph0 mh0">Services</legend>

            <p className=" black-60 ">
              A little introduction to what productizing services even means.
            </p>

            <br />
            <Link className="blue db mb5" to={`/refer/${uid}`}>
              Go To Your Public Referral Page
            </Link>
          </fieldset>

          {state.services &&
            Object.values(state.services)
              .sort((a, b) => a.order - b.order)
              .map(service => <IndividualService {...service} />)}

          <div className="mt3">
            <input
              className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
              type="submit"
              value="+ Add a service"
            />
          </div>
        </form>
      </main>
    </div>
  );
}
Services.propTypes = propTypes;
Services.defaultProps = defaultProps;

const sericePropTypes = {
  dispatch: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  order: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  link: PropTypes.string.isRequired,
};

const serviceDefaultProps = {};

export default function IndividualService({
  dispatch,
  id,
  order,
  name,
  description,
  price,
  link,
}) {
  return (
    <div className="mb5 pt4 bt b--light-gray ">
      <div className="mb4">
        <label className="db fw6 lh-copy f6" htmlFor="password">
          Service Name
          <input
            className="mt1 db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb2"
            type="text"
            name="password"
            id="password"
            placeholder="Professional Pickle Peeler"
            value={name}
            onChange={e =>
              dispatch({
                type: 'DESIGNATION_CHANGED',
                payload: e.target.value,
              })
            }
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
            placeholder="My ideal clients..."
            value={description}
            onChange={e =>
              dispatch({
                type: 'CLIENT_CHANGED',
                payload: e.target.value,
              })
            }
          ></textarea>
        </label>
        <small id="comment-desc" className="f6 black-60">
          If you have never thought about who your ideal clients are here is{' '}
          <a className="blue dib underline">a useful article</a> to help get you
          in the right mindet.
        </small>
      </div>

      <div className="mt3 mb4">
        <label className="db fw6 lh-copy f6" htmlFor="email-address">
          Price
          <input
            className="mt1 db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb2"
            type="text"
            name="email-address"
            id="email-address"
            placeholder="Your name..."
            value={price}
            onChange={e =>
              dispatch({
                type: 'NAME_CHANGED',
                payload: e.target.value,
              })
            }
          />
        </label>
      </div>

      <div className="mt3 mb4">
        <label className="db fw6 lh-copy f6" htmlFor="email-address">
          Link
          <input
            className="mt1 db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb2"
            type="text"
            name="email-address"
            id="email-address"
            placeholder="Your name..."
            value={link}
            onChange={e =>
              dispatch({
                type: 'NAME_CHANGED',
                payload: e.target.value,
              })
            }
          />
        </label>
      </div>
    </div>
  );
}

IndividualService.propTypes = sericePropTypes;
IndividualService.defaultProps = serviceDefaultProps;
