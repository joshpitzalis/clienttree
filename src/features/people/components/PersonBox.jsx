import React from 'react';
import { TextArea, Toggle } from '@duik/it';
import { Timeline, Icon } from 'antd';
import AvatarGenerator from 'react-avatar-generator';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
// import { doc } from 'rxfire/firestore';
import { toast$ } from '../../notifications/toast';
import { Input } from './Input';
import firebase from '../../../utils/firebase';

// import { ONBOARDING_STEP_COMPLETED } from '../../onboarding/onboardingConstants';
// import { NetworkContext } from '../NetworkContext';
// import { toast$ } from '../../notifications/toast';
import {
  // handleContactDelete,
  // handleAddTask,
  // setActiveTaskCount,
  handleTracking,
  setProfileImage,
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
  const [progress, setProgress] = React.useState('Click on image to upload.');

  React.useEffect(() => {
    setState({ ...contact, saving: false });
  }, [contact]);

  React.useEffect(() => {
    dispatch({
      type: 'people/updateForm',
      payload: state,
    });
  }, [dispatch, state]);

  const avatarRef = React.useRef(null);

  // React.useEffect(() => {
  //   async function generateAvatar() {
  //     const photoURL = await avatarRef.current.getImageData();
  //     setState({ ...state, photoURL });
  //   }
  //   if (!state.photoURL) {
  //     generateAvatar();
  //   }
  // }, [avatarRef, state]);

  const updates = [
    { text: 'example  update', date: 'yesterday' },
    { text: 'another example', date: 'last week' },
    { text: 'another example  update', date: '45 days ago' },
  ];

  const setImagePreview = async e => {
    if (e.target.files[0]) {
      const imageFile = e.target.files[0];
      const { size, type } = imageFile;
      if (
        type !== 'image/jpeg' &&
        type !== 'image/gif' &&
        type !== 'image/jpg' &&
        type !== 'image/png'
      ) {
        setProgress('Images can only be jpeg, jpg, png or gif');
        return;
      }
      if (size > 5000000) {
        setProgress('Images can only be 5mb or less');
        return;
      }

      try {
        setState(prevState => ({ ...prevState, saving: true }));
        setProgress('Uploading...');
        setProfileImage({
          imageFile,
          contactId,
        }).then(photoURL => {
          setProgress('Almost done...');
          setState(prevState => ({ ...prevState, photoURL }));
          setTimeout(() => setProgress('Click on image to upload.'), 3000);
        });
      } catch (error) {
        setState({ ...state, saving: false });
        setProgress('Click on image to upload.');
        toast$.next({
          type: 'ERROR',
          message: error,
          from: 'PersonBox/setImagePreview',
        });
      }
    }
  };

  return (
    <div>
      <div
        data-testid="contactModal"
        className={`pa4 br2-bottom bg-layer1 ${
          state.saving && state.saving ? 'bt-orange' : 'bt-green'
        }`}
      >
        <div className="flex flex-row-ns flex-column justify-between items-center pb4 mt0">
          <div className="flex items-center">
            <div className="mr3 flex flex-column">
              <label htmlFor="uploader" className="pointer tc center">
                {state.photoURL && state.photoURL ? (
                  <img
                    alt="profile-preview"
                    className="w2 h-auto w3-ns h-auto-ns br-100"
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
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif"
                  className="dn"
                  id="uploader"
                  data-testid="profileImageUploader"
                  onChange={setImagePreview}
                />
              </label>
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
                  const name = e.target.value;
                  setState(prevState => ({
                    ...prevState,
                    name,
                    saving: true,
                  }));
                }}
              />
              <small
                className="text3 o-50"
                style={{
                  color:
                    (progress === 'Images can only be jpeg, jpg, png or gif' ||
                      progress === 'Images can only be 5mb or less') &&
                    'red',
                }}
              >
                {progress}
              </small>
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
