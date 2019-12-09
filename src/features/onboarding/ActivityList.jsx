import React from 'react';
import PropTypes from 'prop-types';
// import { filter } from 'rxjs/operators';
import { useImmerReducer } from 'use-immer';
import { useSelector, useDispatch } from 'react-redux';
import AvatarGenerator from 'react-avatar-generator';
import { AutoComplete, Progress } from 'antd';
import { collection } from 'rxfire/firestore';
import { map, catchError } from 'rxjs/operators';
import { HelpfulTaskList } from '../people/components/UniversalTaskList';
import { GettingStarted } from './GettingStarted';
import { USER_UPDATED } from '../people/networkConstants';
import firebase from '../../utils/firebase';
import { toast$ } from '../notifications/toast';

const propTypes = {
  uid: PropTypes.string.isRequired,
};
const defaultProps = {};

export function Onboarding({ uid }) {
  const dispatch = useDispatch();

  // gets user onboarding details
  const onboarding = useSelector(
    store => store.user && store.user.onboarding && store.user.onboarding
  );

  const setUser = async payload => {
    dispatch({
      type: USER_UPDATED,
      payload,
    });
  };

  const onboardingComplete = onboarding && onboarding.complete === true;

  const completePercentage =
    onboarding &&
    Math.round(
      ((1 + Object.values(onboarding).filter(_x => !!_x).length) / 7) * 100
    );

  return (
    <div className="pa4">
      <fieldset className="bn">
        <details data-testid="detailBox">
          <summary>
            <legend className="fw7 mb2 dib" data-testid="toggleAddBox">
              {onboardingComplete ? 'Activities' : 'Getting Started'}
            </legend>
          </summary>
          <AddBox setUser={setUser} userId={uid} />
        </details>
        {!onboardingComplete && (
          <div className="mb4">
            <Progress percent={completePercentage} />
            <GettingStarted uid={uid} onboarding={onboarding} />

            {/* <small data-test="onboardingHelpText" className="o-50">
              The tasks above will disappear once you complete all of them. Take
              a few days to complete them, they're not meant to be done all at
              once.
            </small> */}
          </div>
        )}
        <HelpfulTaskList myUid={uid} />
      </fieldset>
    </div>
  );
}

Onboarding.propTypes = propTypes;
Onboarding.defaultProps = defaultProps;

function reducer(draft, action) {
  const { type, payload } = action;

  switch (type) {
    case 'nameUpdated':
      draft.name = payload;
      return draft;
    case 'activityUpdated':
      draft.activity = payload;
      return draft;
    case 'formSubmitted':
      draft.activity = '';
      draft.name = '';
      return draft;
    default:
      return draft;
  }
}

const addPropTypes = {
  setUser: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
};
const addDefaultProps = {};

export function AddBox({ setUser, userId }) {
  const [state, dispatch] = useImmerReducer(reducer, {
    name: '',
    activity: '',
  });
  const { name, activity } = state;

  const avatarRef = React.useRef(null);

  const [allContacts, setAllContacts] = React.useState([]);

  React.useEffect(() => {
    const getAllContacts = collection(
      firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('contacts')
    )
      .pipe(
        map(docs =>
          docs.map(d => {
            const { name: text, photoURL, uid: value } = d.data();
            const item = {
              value,
              text,
              photoURL,
            };

            return item;
          })
        ),
        catchError(error =>
          toast$.next({
            type: 'ERROR',
            message: error.message || error,
          })
        )
      )
      .subscribe(network => setAllContacts(network));

    return () => getAllContacts.unsubscribe();
  }, [userId]);

  const [contacts, setContacts] = React.useState([]);

  const [contactId, setContactId] = React.useState('');

  return (
    <form
      className="center mw5 mw6-ns br3 hidden ba b--black-10 mv4"
      data-testid="addBox"
      onSubmit={async e => {
        e.preventDefault();
        const imgString = await avatarRef.current.getImageData();

        setUser({
          userId,
          name,
          summary: '',
          lastContacted: '',
          taskName: activity,
          imgString,
          // if existing user
          photoURL: '',
          contactId,
          uid: '',
        });

        dispatch({
          type: 'formSubmitted',
        });
      }}
    >
      <h1 className="f4 bg-near-white br3 br--top black-60 mv0 pv2 ph3 flex items-center">
        <AvatarGenerator
          ref={avatarRef}
          height="25"
          width="25"
          colors={['#333', '#222', '#ccc']}
        />{' '}
        Add an Activity
      </h1>

      <div className="pa3 bt b--black-10">
        {/* <label className="db fw4 lh-copy f6 " htmlFor="name"> */}
        {/* <span className="b">Name</span> */}
        <AutoComplete
          dataSource={contacts}
          id="name"
          name="name"
          className="b  input-reset  bg-transparent center br2 b--black-20"
          value={name}
          onChange={payload =>
            dispatch({
              type: 'nameUpdated',
              payload,
            })
          }
          onSelect={(id, opt) => {
            dispatch({
              type: 'nameUpdated',
              payload: opt.props.children,
            });
            setContactId(id);
          }}
          onSearch={searchText =>
            setContacts(
              !searchText
                ? []
                : allContacts.filter(
                    item =>
                      item.text &&
                      item.text.toLowerCase().includes(searchText.toLowerCase())
                  )
            )
          }
          placeholder="Name..."
        ></AutoComplete>
        {/* <input
            className="b pa2 input-reset ba bg-transparent center br2 b--black-20"
            placeholder="Name..."
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={e =>
              dispatch({
                type: 'nameUpdated',
                payload: e.target.value,
              })
            }
          /> */}
        {/* </label> */}
        <label className="db fw4 lh-copy f6 mv3" htmlFor="activity">
          {/* <span className="b">Activity</span> */}
          <input
            className="b pa2 input-reset ba bg-transparent center br2 b--black-20"
            placeholder="Activity..."
            type="text"
            name="activity"
            id="activity"
            value={activity}
            onChange={e =>
              dispatch({
                type: 'activityUpdated',
                payload: e.target.value,
              })
            }
          />
        </label>
        <input type="submit" value="submit" data-testid="addBoxSubmitButton" />
      </div>
    </form>
  );
}

AddBox.propTypes = addPropTypes;
AddBox.defaultProps = addDefaultProps;
