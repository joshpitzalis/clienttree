import React from 'react';
import { Toggle } from '@duik/it';
import { Timeline } from 'antd';
import AvatarGenerator from 'react-avatar-generator';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { usePersonForm, setImage } from '../peopleHelpers/personBox';
import { handleTracking as _handleTracking } from '../peopleAPI';
import { EditBox } from './EditBox';
import { TimeUpdate } from './TimeUpdate';

const personPropTypess = {
  contactId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  handleTracking: PropTypes.func,
};
const personDefaultPropss = {
  handleTracking: _handleTracking,
  contactId: '',
};

/**
 * @param {{
 * uid:string,
  contactId: string,
  onClose: function,
  handleTracking : function,
}}
*/

export const PersonModal = ({
  uid,
  contactId,
  onClose,
  handleTracking = _handleTracking,
}) => {
  // whenever the state of this component gets updated it will debounce for one second then save the new state to firebase
  const [state, setState] = usePersonForm(contactId);

  const avatarRef = React.useRef(null);

  const [activeNote, setActiveNote] = React.useState(1);

  const [progress, setProgress] = React.useState('Click on image to upload.');

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
                  onChange={e =>
                    setImage({ e, setProgress, setState, state, contactId })
                  }
                />
              </label>
            </div>
            <div className="db lh-copy ttc ml3 ">
              <label htmlFor="name">
                <span className="text3">Name</span>
                <input
                  className="db border-box hover-black w-100 measure-narrow ba b--black-20 pa2 br2 mb2"
                  type="text"
                  name="name"
                  id="name"
                  data-testid="contactName"
                  placeholder="Their name..."
                  value={state.name || ''}
                  onChange={event => {
                    const name = event.target.value;
                    return setState(prevState => ({
                      ...prevState,
                      name,
                      saving: true,
                    }));
                  }}
                />
              </label>
              <small
                className="text3"
                style={{
                  color:
                    (progress === 'Images can only be jpeg, jpg, png or gif' ||
                      progress === 'Images can only be 5mb or less') &&
                    'red',
                }}
              >
                {progress}
              </small>
            </div>
          </div>
          <Toggle
            description={
              <span className="text3">
                {state.tracked
                  ? 'You currently work with this person'
                  : 'You do not work with this person'}
              </span>
            }
            checked={state.tracked || null}
            onChange={e =>
              handleTracking(
                e.target.checked,
                uid,
                contactId,
                state.name,
                state.photoURL
              )
            }
            data-testid="dashSwitch"
            label={
              <b className="text1">
                {state.tracked ? 'Remove from Workboard' : 'Add to Workboard'}
              </b>
            }
          />
        </div>
        <Timeline>
          {Object.values(
            state.notes
              ? state.notes
              : {
                  1: {
                    id: 1,
                    text: '',
                    lastUpdated: +new Date(),
                  },
                }
          ).map(note => (
            <Timeline.Item
              color="green"
              className="pointer"
              key={note.id}
              onClick={() => setActiveNote(note.id)}
            >
              {note.id === 1 ? (
                <small className="i" data-testid="addUpdate">
                  Add an update{' '}
                </small>
              ) : (
                <TimeUpdate lastUpdated={note.lastUpdated} />
              )}

              <div>
                {activeNote === note.id ? (
                  <EditBox
                    // setNotes={setNotes}
                    note={note}
                    notes={state.notes}
                    setActiveNote={setActiveNote}
                    setState={setState}
                  />
                ) : (
                  <p>{note.id === 1 ? 'Click to edit...' : note.text}</p>
                )}
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
      <div className="flex justify-between items-baseline mv4">
        <div className="flex items-baseline">
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
          {/* <small
            className="text3 o-50 ml3"
            style={{
              color: true && 'red',
            }}
          >
            {true ? 'Saving...' : 'Saved'}
          </small> */}
        </div>
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

// const ProfileImage = (avatarRef, setProgress, setState, state, contactId) => (
//   <label htmlFor="uploader" className="pointer tc center">
//     {state.photoURL && state.photoURL ? (
//       <img
//         alt="profile-preview"
//         className="w2 h-auto w3-ns h-auto-ns br-100"
//         src={state.photoURL}
//       />
//     ) : (ß
//       <AvatarGenerator
//         ref={avatarRef}
//         height="50"
//         width="50"
//         colors={['#333', '#222', '#ccc']}
//       />
//     )}
//     <input
//       type="file"
//       accept=".jpg,.jpeg,.png,.gif"
//       className="dn"
//       id="uploader"
//       data-testid="profileImageUploader"
//       onChange={e => setImage({ e, setProgress, setState, state, contactId })}
//     />
//   </label>
// );

// ProfileImage.propTypes = {
//   avatarRef: PropTypes.func.isRequired,
//   setProgress: PropTypes.func.isRequired,
//   setState: PropTypes.func.isRequired,
//   state: PropTypes.shape({}).isRequired,
//   contactId: PropTypes.string.isRequired,
// };
// ProfileImage.defaultProps = {};

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
