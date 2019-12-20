import React from 'react';
import { TextArea, Toggle } from '@duik/it';
import { Timeline, Icon } from 'antd';
import AvatarGenerator from 'react-avatar-generator';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
// import { doc } from 'rxfire/firestore';

import { Input } from './Input';

// import { ONBOARDING_STEP_COMPLETED } from '../../onboarding/onboardingConstants';
// import { NetworkContext } from '../NetworkContext';
// import { toast$ } from '../../notifications/toast';
import {
  // handleContactDelete,
  // handleAddTask,
  // setActiveTaskCount,
  handleTracking,
} from '../peopleAPI';
// import firebase from '../../../utils/firebase';
// import { ToDoList } from './ToDoList';
// import { ConfirmDelete } from './ConfirmDelete';

const personPropTypess = {
  contactId: PropTypes.string.isRequired,
  // selectedUserUid: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  incrementStats: PropTypes.func,
};
const personDefaultPropss = {
  incrementStats: handleTracking,
};

export const PersonModal = ({
  contactId,
  onClose,
  incrementStats = handleTracking,
}) => {
  const dispatch = useDispatch();

  const contact = useSelector(store =>
    store.contacts.find(person => person.uid === contactId)
  );

  const [state, setState] = React.useState({ saving: false });

  React.useEffect(() => {
    setState({ ...contact, saving: false });
  }, [contact]);

  const avatarRef = React.useRef(null);

  const updates = [
    { text: 'example  update', date: 'yesterday' },
    { text: 'another example', date: 'last week' },
    { text: 'another example  update', date: '45 days ago' },
  ];

  return (
    <div>
      <div
        data-testid="contactModal"
        className={`pa4 br2-bottom bg-layer1 ${
          state.saving && state.saving ? 'bt-orange' : 'bt-green'
        }`}
      >
        <div className="flex flex-row-ns flex-column justify-between items-center pb4 mt0">
          <div className="flex">
            <div className="mr3">
              {state.photoURL && state.photoURL ? (
                <img
                  alt={state.name}
                  className="w2 h2 w3-ns h3-ns br-100"
                  src={state.photoURL}
                />
              ) : (
                <AvatarGenerator
                  ref={avatarRef}
                  height="50"
                  width="50"
                  colors={['#333', '#222', '#ccc']}
                />
              )}
            </div>

            <label className="db lh-copy ttc ml3 " htmlFor="name">
              <span className="text3">Name</span>
              <input
                className="db border-box hover-black w-100 measure-narrow ba b--black-20 pa2 br2 mb2"
                type="text"
                name="name"
                id="name"
                data-testid="contactName"
                placeholder="Their name..."
                value={state.name}
                onChange={e => {
                  const payload = {
                    ...state,
                    name: e.target.value,
                    saving: true,
                  };
                  setState({ ...payload });
                  dispatch({
                    type: 'people/updateForm',
                    payload,
                  });
                }}
              />
            </label>
          </div>
          <Toggle
            description={
              <p className="text3">Track this person on the Dashboard</p>
            }
            label={<b className="text1">Projects Dashboard</b>}
          />
        </div>
        <TextArea placeholder="Add an update" rows={10} className="mb0" />
        <div className="flex justify-end items-baseline mt0 pa0 mb3">
          <p className="pb3 mr3 text3 mt0">Change the date?</p>
          <Input
            setState={setState}
            state={state}
            value={state.lastContacted}
            name="lastContacted"
            placeholder="Last contacted..."
            type="date"
            className="mt0"
          />
        </div>
        <Timeline>
          {updates.map(({ text, date }) => (
            <Timeline.Item color="green" style={{}}>
              {date} | {text}
              <Icon
                type="delete"
                style={{ color: 'red', paddingLeft: '5px' }}
              />
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
      <div className="flex justify-between items-baseline mv4">
        <button
          type="button"
          onClick={() => onClose()}
          data-testid="closeBox"
          className="btn2 
           ph3 pv2 bn pointer br1 
           grow b
          mb4"
        >
          Close
        </button>
        <button
          type="button"
          onClick={() => onClose()}
          data-testid="deletePerson"
          className="red underline-hover ph3 pv2 bn bg-transparent pointer f6 br1 mb4"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
PersonModal.propTypes = personPropTypess;
PersonModal.defaultProps = personDefaultPropss;

// const handleDelete = async (_name, _uid, _userId) => {
//   try {
//     await handleContactDelete(_uid, _userId);
//     onClose();
//   } catch (error) {
//     toast$.next({ type: 'ERROR', message: error.message || error });
//   }
// };
// const handleAddingTask = (task, myUid, theirUid, photoURL) => {
//   handleAddTask(task, myUid, theirUid, photoURL).catch(error =>
//     toast$.next({ type: 'ERROR', message: error.message || error })
//   );
// };
// const handleUpdateUser = async e => {
//   e.preventDefault();
//   // tk validity check goes here
//   try {
//     const newUser = !state.photoURL;
//     if (newUser) {
//       const imgString = await avatarRef.current.getImageData();
//       dispatch({
//         type: ONBOARDING_STEP_COMPLETED,
//         payload: { userId: uid, onboardingStep: 'addedSomeone' },
//       });
//       await setContact({ ...state, imgString, userId: uid });
//       onClose();
//       return;
//     }
//     await setContact({ ...state, userId: uid, contactId: state.uid });
//     onClose();
//   } catch (error) {
//     toast$.next({ type: 'ERROR', message: error.message || error });
//   }
// };
//
// if (true) {
//   throw new Error();
// }
