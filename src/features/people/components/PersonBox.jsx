import React from 'react';
import { TextArea, Toggle, Datepicker, DatepickerContainer } from '@duik/it';
import { Timeline, Icon } from 'antd';
import AvatarGenerator from 'react-avatar-generator';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { toast$ } from '../../notifications/toast';
// import { ONBOARDING_STEP_COMPLETED } from '../../onboarding/onboardingConstants';
// import { NetworkContext } from '../NetworkContext';
// import { toast$ } from '../../notifications/toast';
import {
  // handleContactDelete,
  // handleAddTask,
  // setActiveTaskCount,
  handleTracking as _handleTracking,
  setProfileImage,
} from '../peopleAPI';

// import firebase from '../../../utils/firebase';
// import { ToDoList } from './ToDoList';
// import { ConfirmDelete } from './ConfirmDelete';

const personPropTypess = {
  contactId: PropTypes.string.isRequired,
  // selectedUserUid: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  handleTracking: PropTypes.func,
};
const personDefaultPropss = {
  handleTracking: _handleTracking,
};

export const PersonModal = ({
  contactId,
  onClose,
  handleTracking = _handleTracking,
}) => {
  const dispatch = useDispatch();

  const contact = useSelector(store =>
    store.contacts.find(person => person.uid === contactId)
  );

  const userId = useSelector(store => store.user.userId);

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

  const setImage = async e => {
    const imageFile = e.target.files && e.target.files[0];
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
    if (imageFile) {
      try {
        setState(prevState => ({ ...prevState, saving: true }));
        setProgress('Uploading...');
        const photoURL = await setProfileImage({
          imageFile,
          contactId,
        });
        setProgress('Click on image to upload.');
        setState(prevState => ({ ...prevState, photoURL }));
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

  // ###

  const [notes, setNotes] = React.useState({
    1: {
      id: 1,
      text: '',
      lastUpdated: +new Date(),
    },
  });

  const [activeNote, setActiveNote] = React.useState(1);

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
                  onChange={setImage}
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
              <p className="text3">
                {state.tracked
                  ? 'This person is on your dashboard'
                  : 'This person is not on your Dashboard'}
              </p>
            }
            checked={state.tracked}
            onChange={e =>
              handleTracking(
                e.target.checked,
                userId,
                contactId,
                state.name,
                state.photoURL
              )
            }
            data-testid="dashSwitch"
            label={
              <b className="text1">
                {state.tracked ? 'Remove from Dashbord' : 'Add to Dashboard'}
              </b>
            }
          />
        </div>

        <Timeline>
          {Object.values(notes).map(note =>  (
              <Timeline.Item
                color="green"
                className="pointer"
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
                      setNotes={setNotes}
                      note={note}
                      notes={notes}
                      setActiveNote={setActiveNote}
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

function EditBox({ setNotes, note, notes, setActiveNote }) {
  const { id, text, lastUpdated } = note;

  const [message, setMessage] = React.useState(text);

  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    setSaving(false);
  }, [note]);

  return (
    <div>
      <TextArea
        placeholder="Click to edit..."
        rows={10}
        className="mb0"
        onChange={e => {
          setSaving(true);
          setMessage(e.target.value);
          const newTimestamp = +new Date();
          const newId = id === 1 ? newTimestamp : id;
          const newNotes = {
            ...notes,
            [newId]: {
              id: newId,
              text: e.target.value,
              lastUpdated: id === 1 ? newTimestamp : lastUpdated,
            },
          };
          setNotes(newNotes);
          setActiveNote(newId);
        }}
        value={message}
      />
      {note.id !== 1 && (
        <div className="flex justify-between items-start mt0 pa0 mb3">
          <small
            className="text3 o-50 mr3"
            style={{
              color: saving && 'red',
            }}
          >
            {saving ? 'Saving...' : 'Saved'}
          </small>
          <Icon
            className="o-50"
            type="delete"
            style={{
              color: 'red',
            }}
          />
        </div>
      )}
    </div>
  );
}

EditBox.propTypes = {
  setNotes: PropTypes.func.isRequired,
  note: PropTypes.shape({
    id: PropTypes.string,
    text: PropTypes.string,
    lastUpdated: PropTypes.string,
  }).isRequired,

  notes: PropTypes.any.isRequired,
  setActiveNote: PropTypes.func.isRequired,
};

EditBox.defaultProps = {};

function TimeUpdate({ lastUpdated }) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div>
      {visible ? (
        <DatepickerContainer>
          <Datepicker
            value={new Date(lastUpdated)}
            onDateChange={x => {
              console.log(+new Date(x));
              setVisible(false);
            }}
            maxDate={new Date()}
          />
        </DatepickerContainer>
      ) : (
        <button
          type="button"
          onClick={() => setVisible(true)}
          className="bn text3 underline-hover pointer"
        >
          {formatDistanceToNow(new Date(lastUpdated), {
            addSuffix: true,
          })}
        </button>
      )}
    </div>
  );
}

TimeUpdate.propTypes = {
  lastUpdated: PropTypes.string.isRequired,
};

TimeUpdate.defaultProps = {};
