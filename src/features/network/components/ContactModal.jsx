import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import AvatarGenerator from 'react-avatar-generator';
import { doc } from 'rxfire/firestore';
import { ONBOARDING_STEP_COMPLETED } from '../../onboarding/onboardingConstants';
import { NetworkContext } from '../NetworkContext';
import { toast$ } from '../../notifications/toast';
import {
  handleContactDelete,
  handleAddTask,
  setActiveTaskCount,
  handleTracking,
} from '../networkAPI';
import firebase from '../../../utils/firebase';
import { ToDoList } from './ToDoList';
import { ConfirmDelete } from './ConfirmDelete';
import { Input } from './Input';

const modalPropTypes = {
  uid: PropTypes.string.isRequired,
  selectedUserUid: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  incrementStats: PropTypes.func.isRequired,
};
const modalDefaultProps = {};

export function Modal({
  uid,
  selectedUserUid,
  onClose,
  incrementStats = handleTracking,
}) {
  const dispatch = useDispatch();

  const [state, setState] = React.useState({
    userId: uid,
    name: '',
    summary: '',
    tracked: false,
    lastContacted: '',
    contactId: '',
    photoURL: '',
    imgString: '',
    activeTaskCount: 0,
  });

  React.useEffect(() => {
    if (selectedUserUid) {
      const subscription = doc(
        firebase
          .firestore()
          .collection('users')
          .doc(uid)
          .collection('contacts')
          .doc(selectedUserUid)
      ).subscribe(user => {
        setState({ ...user.data() });
      });
      return () => subscription.unsubscribe();
    }
  }, [selectedUserUid, uid]);

  const { setContact } = React.useContext(NetworkContext);

  const avatarRef = React.useRef(null);

  const handleDelete = async (_name, _uid, _userId) => {
    try {
      await handleContactDelete(_uid, _userId);
      onClose();
    } catch (error) {
      toast$.next({ type: 'ERROR', message: error.message || error });
    }
  };

  const handleAddingTask = (task, myUid, theirUid, photoURL) => {
    handleAddTask(task, myUid, theirUid, photoURL).catch(error =>
      toast$.next({ type: 'ERROR', message: error.message || error })
    );
  };

  const handleUpdateUser = async e => {
    e.preventDefault();

    // tk validity check goes here

    try {
      const newUser = !state.photoURL;

      if (newUser) {
        const imgString = await avatarRef.current.getImageData();
        dispatch({
          type: ONBOARDING_STEP_COMPLETED,
          payload: { userId: uid, onboardingStep: 'addedSomeone' },
        });
        await setContact({ ...state, imgString, userId: uid });
        onClose();
        return;
      }

      await setContact({ ...state, userId: uid, contactId: state.uid });
      onClose();
    } catch (error) {
      toast$.next({ type: 'ERROR', message: error.message || error });
    }
  };

  return (
    <div data-testid="contactModal">
      <div className="w-100 tc">
        {state.photoURL ? (
          <img
            alt={state.name}
            className="w2 h2 w3-ns h3-ns br-100"
            src={state.photoURL}
          />
        ) : (
          <AvatarGenerator
            ref={avatarRef}
            height="100"
            width="100"
            colors={['#333', '#222', '#ccc']}
          />
        )}
      </div>
      <div className="flex">
        <form className=" w-50" onSubmit={handleUpdateUser}>
          <fieldset id="contact" className="ba b--transparent ph0 mh0 tl">
            <legend className="f4 fw6 ph0 mh0 dn">Profile</legend>
            <div className="flex justify-center">
              <div>
                <Input
                  setState={setState}
                  state={state}
                  value={state.name}
                  name="name"
                  placeholder="Their name..."
                />

                <Input
                  setState={setState}
                  state={state}
                  value={state.lastContacted}
                  name="lastContacted"
                  placeholder="Last contacted..."
                  type="date"
                />

                <Input
                  setState={setState}
                  state={state}
                  value={state.summary}
                  name="summary"
                  placeholder="Notes..."
                  type="textarea"
                />

                <label className="pa0 ma0 lh-copy f6 pointer" htmlFor="tracked">
                  <input
                    type="checkbox"
                    id="tracked"
                    className="mr1"
                    checked={state.tracked}
                    onChange={e =>
                      incrementStats(
                        e.target.checked,
                        uid,
                        selectedUserUid,
                        state.name,
                        state.photoURL
                      )
                    }
                    data-testid="leadToggle"
                  />
                  Track this contact as a lead on the dashboard
                </label>
              </div>
            </div>
          </fieldset>
          <div className="mt3 flex justify-around items-center">
            <input
              className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
              type="submit"
              value="Save"
            />

            {selectedUserUid && (
              <ConfirmDelete
                handleDelete={() => handleDelete(state.name, state.uid, uid)}
                title={state.name}
                activeTaskCount={state.activeTaskCount}
              />
            )}
          </div>
        </form>
        {selectedUserUid && (
          <div className="w-50">
            <ToDoList
              myUid={uid}
              theirUid={selectedUserUid}
              handleAddingTask={handleAddingTask}
              activeTaskCount={state.activeTaskCount}
              _setActiveTaskCount={setActiveTaskCount}
              photoURL={state.photoURL}
            />
          </div>
        )}
      </div>
    </div>
  );
}
Modal.propTypes = modalPropTypes;
Modal.defaultProps = modalDefaultProps;
