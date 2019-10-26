import React from 'react';
import PropTypes from 'prop-types';
// import { filter } from 'rxjs/operators';
import { useImmerReducer } from 'use-immer';
import { useDispatch } from 'react-redux';
import AvatarGenerator from 'react-avatar-generator';
import { AutoComplete } from 'antd';
import { HelpfulTaskList } from '../network/components/UniversalTaskList';
import { GettingStarted } from './GettingStarted';
import { USER_UPDATED } from '../network/networkConstants';

const propTypes = {
  uid: PropTypes.string.isRequired,
};
const defaultProps = {};

export function Onboarding({ uid }) {
  const dispatch = useDispatch();
  const setUser = async payload => {
    dispatch({
      type: USER_UPDATED,
      payload,
    });
  };

  return (
    <form className="pa4">
      <fieldset className="bn">
        <details data-testid="detailBox">
          <summary>
            <legend className="fw7 mb2 dib" data-testid="toggleAddBox">
              Activities
            </legend>
          </summary>
          <AddBox setUser={setUser} userId={uid} />
        </details>
        <GettingStarted uid={uid} />
        <HelpfulTaskList myUid={uid} />
      </fieldset>
    </form>
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

  const allContacts = [
    { value: 'string1', text: 'red' },
    { value: 'string2', text: 'blue' },
    { value: 'string3', text: 'green' },
  ];
  const [contacts, setContacts] = React.useState([]);

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
          contactId: '',
          uid: '',
        });

        dispatch({
          type: 'formSubmitted',
        });
      }}
    >
      <h1 className="f4 bg-near-white br3 br--top black-60 mv0 pv2 ph3 flex items-center">
        <AvatarGenerator ref={avatarRef} height="25" width="25" /> Add an
        Activity
      </h1>
      <AutoComplete
        dataSource={contacts}
        className="b pa2 input-reset ba bg-transparent center br2 b--black-20"
        onChange={e => console.log(e)}
        onSelect={id => console.log(id)}
        onSearch={searchText =>
          setContacts(
            !searchText
              ? []
              : allContacts.filter(item => item.text.includes(searchText))
          )
        }
        placeholder="input here"
      ></AutoComplete>
      <div className="pa3 bt b--black-10">
        <label className="db fw4 lh-copy f6 " htmlFor="name">
          {/* <span className="b">Name</span> */}
          <input
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
          />
        </label>
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
