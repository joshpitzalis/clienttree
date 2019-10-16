import React from 'react';
import PropTypes from 'prop-types';
import AvatarGenerator from 'react-avatar-generator';
import { doc } from 'rxfire/firestore';

import { NetworkContext } from '../NetworkContext';
import { toast$ } from '../../notifications/toast';
import {
  handleContactDelete,
  handleAddTask,
  setActiveTaskCount,
} from '../networkAPI';
import firebase from '../../../utils/firebase';
import { ToDoList } from './ToDoList';
import { ConfirmDelete } from './ConfirmDelete';
import { Input } from './Input';

const modalPropTypes = {
  uid: PropTypes.string.isRequired,
  selectedUserUid: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
const modalDefaultProps = {};

export function Modal({ uid, selectedUserUid, onClose }) {
  const [state, setState] = React.useState({
    userId: uid,
    name: '',
    summary: '',
    tracked: false,
    lastContacted: '',
    contactId: '',
    photoURL: '',
    imgString: '',
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

  const handleDelete = (_name, _uid, _userId) =>
    handleContactDelete(_name, _uid, _userId)
      .then(() => {
        onClose();
        toast$.next({
          type: 'SUCCESS',
          message: `${_name} Successfully Deleted`,
        });
      })
      .catch(error =>
        toast$.next({ type: 'ERROR', message: error.message || error })
      );

  const handleAddingTask = (task, myUid, theirUid) => {
    handleAddTask(task, myUid, theirUid).catch(error =>
      toast$.next({ type: 'ERROR', message: error.message || error })
    );
  };

  const handleTracking = async (checked, userId, contactId, name, photoURL) => {
    const updateSelectedUser = (_userId, _contactId, tracked) => {
      firebase
        .firestore()
        .collection('users')
        .doc(_userId)
        .collection('contacts')
        .doc(_contactId)
        .set(
          {
            tracked,
          },
          { merge: true }
        );
    };

    const updateDashboardState = async (
      _userId,
      tracked,
      _contactId,
      _name,
      _photoURL
    ) => {
      const dashboardState = await firebase
        .firestore()
        .collection('users')
        .doc(_userId)
        .get()
        .then(data => data.data().dashboard);

      const newState = { ...dashboardState };

      if (tracked) {
        newState.people = {
          ...newState.people,
          [_contactId]: {
            id: _contactId,
            name: _name,
            photoURL: _photoURL,
          },
        };

        newState.stages.stage1.people = [
          ...newState.stages.stage1.people,
          _contactId,
        ];
      }

      if (!tracked) {
        delete newState.people[_contactId];

        newState.stages = Object.entries(newState.stages).reduce(
          (a, [k, stage]) => ({
            ...a,
            [k]: {
              ...stage,
              people:
                stage.people && stage.people.length
                  ? stage.people.filter(person => person !== _contactId)
                  : [],
            },
          }),
          {}
        );
      }

      firebase
        .firestore()
        .collection('users')
        .doc(_userId)
        .set(
          {
            dashboard: newState,
          },
          { merge: true }
        );
    };

    try {
      await updateDashboardState(userId, checked, contactId, name, photoURL);
      updateSelectedUser(userId, contactId, checked);
    } catch (error) {
      toast$.next({ type: 'ERROR', message: error.message || error });
    }
  };

  const handleUpdateUser = async e => {
    e.preventDefault();

    // tk validity check goes here

    try {
      const newUser = !state.photoURL;

      if (newUser) {
        const imgString = await avatarRef.current.getImageData();

        await setContact({ ...state, imgString, userId: uid });
        onClose();
        return;
      }

      await setContact({ ...state, userId: uid });
      onClose();
    } catch (error) {
      toast$.next({ type: 'ERROR', message: error.message || error });
    }
  };

  return (
    <form
      className="measure center"
      data-testid="contactModal"
      onSubmit={handleUpdateUser}
    >
      <fieldset id="contact" className="ba b--transparent ph0 mh0 tl">
        <div className="w-100 tc">
          {state.photoURL ? (
            <img
              alt={state.name}
              className="w2 h2 w3-ns h3-ns br-100"
              src={state.photoURL}
            />
          ) : (
            <AvatarGenerator ref={avatarRef} height="100" width="100" />
          )}
        </div>
        <legend className="f4 fw6 ph0 mh0 dn">Profile</legend>
        <div className="flex justify-center">
          <div className="w-50">
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
              name="Last Contacted"
              placeholder="Last contacted..."
            />

            <Input
              setState={setState}
              state={state}
              value={state.lastContacted}
              name="Summary"
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
                  handleTracking(
                    e.target.checked,
                    uid,
                    selectedUserUid,
                    state.name,
                    state.photoURL
                  )
                }
              />
              Tracked on the Dashboard
            </label>
          </div>

          {selectedUserUid && (
            <div className="w-50">
              <ToDoList
                myUid={uid}
                theirUid={selectedUserUid}
                handleAddingTask={handleAddingTask}
                activeTaskCount={state.activeTaskCount}
                _setActiveTaskCount={setActiveTaskCount}
              />
            </div>
          )}
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
          />
        )}
      </div>
    </form>
  );
}
Modal.propTypes = modalPropTypes;
Modal.defaultProps = modalDefaultProps;
