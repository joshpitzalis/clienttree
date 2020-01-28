import React from 'react';
import { Toggle } from '@duik/it';
import { Timeline } from 'antd';
import AvatarGenerator from 'react-avatar-generator';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { usePersonForm, setImage } from '../peopleHelpers/personBox';
import { handleTracking as _handleTracking } from '../peopleAPI';
import { EditBox } from './EditBox';
import { TimeUpdate } from './TimeUpdate';
import { ConfirmDelete } from './ConfirmDelete';

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
  handleDelete: function,
}}
*/

export const PersonModal = ({
  uid,
  contactId,
  onClose,
  handleTracking = _handleTracking,
  handleDelete,
  newPerson,
}) => {
  const dispatch = useDispatch();
  const avatarRef = React.useRef(null);
  // whenever the state of this component gets updated
  // it will debounce for one second then save the new state to firebase
  // the new state then streams in through rxjs firebase listeners setup at the root
  const [state, setState] = usePersonForm(contactId);

  React.useEffect(() => {
    if (state.photoURL === null) {
      setState({ ...state, photoURL: avatarRef.current.getImageData() });
    }
  }, [avatarRef, setState, state]);

  const [activeNote, setActiveNote] = React.useState(9007199254740991);

  const [progress, setProgress] = React.useState('Click on image to upload.');

  const activeTasks = useSelector(
    store =>
      store.tasks &&
      store.tasks.filter(
        task => task.completedFor === state.uid && task.dateCompleted === null
      )
  );

  React.useEffect(() => {
    // not sure how to just fire effect on unmount, removing the redundant function breaks tests
    const redundant = () => {};
    return () => dispatch({ type: 'people/clearSelectedUser' });
  }, [dispatch]);

  return (
    <div>
      <div
        data-testid="contactModal"
        className={`pa4 br2-bottom bg-layer1 ${
          state && state.saving && state.saving ? 'bt-orange' : 'bt-green'
        }`}
      >
        <div className="flex flex-row-ns flex-column justify-between items-center pb4 mt0">
          <div className="flex items-center">
            <div className="mr3 flex flex-column">
              <label htmlFor="uploader" className="pointer tc center">
                {state && state.photoURL && state.photoURL ? (
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
                  className="db border-box hover-black w-100 measure-narrow ba b--black-20 pa2 br2 mb2 ttc"
                  type="text"
                  name="name"
                  id="name"
                  data-testid="contactName"
                  placeholder="Their name..."
                  value={state.name || ''}
                  onChange={event =>
                    setState({
                      ...state,
                      name: event.target.value,
                      saving: true,
                      notes: { ...state.notes },
                      photoURL:
                        state.photoURL === null
                          ? avatarRef.current.getImageData()
                          : state.photoURL,
                    })
                  }
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
            onChange={e => {
              // setState({
              //   ...state,
              //   tracked: e.target.checked,
              //   saving: true,
              // });
              handleTracking(
                e.target.checked,
                uid,
                contactId,
                state.name,
                state.photoURL
              );
            }}
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
                  9007199254740991: {
                    id: 9007199254740991,
                    text: '',
                    lastUpdated: 9007199254740991,
                  },
                }
          )
            .sort((a, b) => {
              if (b.lastUpdated < a.lastUpdated) {
                return -1;
              }
              if (b.lastUpdated > a.lastUpdated) {
                return 1;
              }
              return 0;
            })
            .map(note => (
              <Timeline.Item color="green" className="pointer" key={note.id}>
                {note.id === 9007199254740991 ? (
                  <small
                    className={`i ${activeNote !== 9007199254740991 &&
                      'underline pointer'}`}
                    data-testid="addUpdate"
                    onClick={() => setActiveNote(note.id)}
                    onKeyDown={() => setActiveNote(note.id)}
                    role="button"
                    tabIndex={-1}
                  >
                    Add a new update{' '}
                  </small>
                ) : (
                  <TimeUpdate
                    lastUpdated={note.lastUpdated}
                    setState={setState}
                    note={note}
                  />
                )}
                <div>
                  {activeNote === note.id ? (
                    <EditBox
                      note={note}
                      notes={state.notes}
                      setActiveNote={setActiveNote}
                      setState={setState}
                      state={state}
                      theirId={contactId}
                      myId={uid}
                    />
                  ) : (
                    <p>
                      <span
                        onClick={() => setActiveNote(note.id)}
                        onKeyDown={() => setActiveNote(note.id)}
                        role="button"
                        tabIndex={-1}
                      >
                        {note.id === 9007199254740991
                          ? 'Click to edit...'
                          : note.text}
                      </span>
                    </p>
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
          {state.saving !== null && (
            <small
              data-testid="saveIndicator"
              className="text3 o-50 ml3"
              style={{ color: state.saving ? 'orange' : 'green' }}
            >
              {state.saving ? 'Saving...' : 'Saved'}
            </small>
          )}
        </div>
        {!newPerson && (
          <ConfirmDelete
            className="red underline-hover ph3 pv2 bn bg-transparent pointer f6 br1 mb4"
            testid="deleteContact"
            handleDelete={() => handleDelete(state.name, state.uid, uid)}
            title={state.name}
            activeTaskCount={activeTasks.length}
            tracked={state.tracked}
          />
        )}
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
