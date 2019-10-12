import React from 'react';
import PropTypes from 'prop-types';
import AvatarGenerator from 'react-avatar-generator';
import { collectionData } from 'rxfire/firestore';
import { NetworkContext } from './NetworkContext';
import { toast$ } from '../notifications/toast';
import {
  handleContactDelete,
  handleAddTask,
  handleDeleteTask,
  handleCompleteTask,
  setActiveTaskCount,
} from './networkAPI';
import firebase from '../../utils/firebase';

const modalPropTypes = {
  uid: PropTypes.string.isRequired,
  selectedUser: PropTypes.shape({
    name: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
    lastContacted: PropTypes.string.isRequired,
    photoURL: PropTypes.string.isRequired,
    activeTaskCount: PropTypes.number.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
};
const modalDefaultProps = {};

export function Modal({ uid, selectedUser, onClose }) {
  const [state, setState] = React.useState({
    userId: uid,
    name: selectedUser.name || '',
    summary: selectedUser.summary || '',
    lastContacted: selectedUser.lastContacted || '',
    contactId: selectedUser.uid || '',
    photoURL: selectedUser.photoURL || '',
    imgString: '',
  });

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
  return (
    <form
      className="measure center"
      data-testid="contactModal"
      onSubmit={async e => {
        e.preventDefault();
        // tk validity check goes here
        if (!state.photoURL) {
          const imgString = await avatarRef.current.getImageData();

          await setContact({ ...state, imgString });
          onClose();
          return;
        }
        await setContact(state);
        onClose();
      }}
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
        <div className="flex">
          <div className="w-50 ">
            <div className="mt3 mb4 ">
              <label className="db fw6 lh-copy f6 " htmlFor="name">
                Name
                <input
                  className="db border-box hover-black w-100 measure-narrow ba b--black-20 pa2 br2 mb2"
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Your name..."
                  value={state.name}
                  onChange={e => setState({ ...state, name: e.target.value })}
                />
              </label>
            </div>

            <div className="mt3 mb4">
              <label className="db fw6 lh-copy f6" htmlFor="lastContacted">
                Last Contacted
                <input
                  className="db border-box hover-black w-100 measure-narrow ba b--black-20 pa2 br2 mb2"
                  type="text"
                  name="lastContacted"
                  id="lastContacted"
                  placeholder="Last contacted..."
                  value={state.lastContacted}
                  onChange={e =>
                    setState({ ...state, lastContacted: e.target.value })
                  }
                />
              </label>
            </div>

            <div className="mb4">
              <label htmlFor="comment" className="f6 b db mb2">
                Summary
                <textarea
                  id="comment"
                  name="comment"
                  rows="5"
                  className="db border-box hover-black w-100 measure-narrow ba b--black-20 pa2 br2 mb2"
                  aria-describedby="comment-desc"
                  placeholder="Notes..."
                  value={state.summary}
                  onChange={e =>
                    setState({ ...state, summary: e.target.value })
                  }
                ></textarea>
              </label>
            </div>
          </div>

          <div className="w-50">
            {!!Object.values(selectedUser).length && (
              <ToDoList
                myUid={uid}
                theirUid={selectedUser.uid}
                handleAddingTask={handleAddingTask}
                activeTaskCount={selectedUser.activeTaskCount}
                _setActiveTaskCount={setActiveTaskCount}
              />
            )}
          </div>
        </div>
      </fieldset>
      <div className="mt3 flex justify-around items-center">
        <input
          className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
          type="submit"
          value="Save"
        />

        {!!Object.values(selectedUser).length && (
          <ConfirmDelete
            handleDelete={() =>
              handleDelete(selectedUser.name, selectedUser.uid, uid)
            }
            title={state.name}
          />
        )}
      </div>
    </form>
  );
}
Modal.propTypes = modalPropTypes;
Modal.defaultProps = modalDefaultProps;

const confirmDeletePropTypes = {
  handleDelete: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
const confirmDeleteDefaultProps = {};

export const ConfirmDelete = ({ handleDelete, title }) => {
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  return (
    <div>
      {confirmDelete ? (
        <div>
          <small className="f6 black-70 small-caps">
            {`Are you sure you want to delete ${title} ?`}
          </small>
          <div className="mv3">
            <button
              className="f6 red small-caps pointer link dim ba bw1 ph3 pv2 mb2 dib b--red"
              type="button"
              onClick={handleDelete}
            >
              {`Confirm Delete ${title}`}
            </button>
            <button
              className="f6 small-caps bn pointer ml3 black-70"
              type="button"
              onClick={() => setConfirmDelete(false)}
            >
              Nevermind
            </button>
          </div>
        </div>
      ) : (
        <button
          className="f6  small-caps bn pointer"
          type="button"
          onClick={() => setConfirmDelete(true)}
        >
          {`Delete ${title}`}
        </button>
      )}
    </div>
  );
};

ConfirmDelete.propTypes = confirmDeletePropTypes;
ConfirmDelete.defaultProps = confirmDeleteDefaultProps;

const propTypes = {
  myUid: PropTypes.string.isRequired,
  theirUid: PropTypes.string.isRequired,
  handleAddingTask: PropTypes.func.isRequired,
  activeTaskCount: PropTypes.number.isRequired,
  _setActiveTaskCount: PropTypes.func.isRequired,
};

const defaultProps = {};

const useFetchCollection = (
  myUid,
  theirUid,
  activeTaskCount,
  _setActiveTaskCount
) => {
  const [helpfulTasks, setHelpfulTasks] = React.useState([]);

  React.useEffect(() => {
    const subscription = collectionData(
      firebase
        .firestore()
        .collection('users')
        .doc(myUid)
        .collection('contacts')
        .doc(theirUid)
        .collection('helpfulTasks')
    ).subscribe(tasks => {
      if (tasks && tasks.length) {
        const newActiveTaskCount = tasks.filter(task => !task.dateCompleted)
          .length;

        console.log({ newActiveTaskCount });

        if (activeTaskCount !== newActiveTaskCount) {
          _setActiveTaskCount(myUid, theirUid, newActiveTaskCount);
        }

        setHelpfulTasks(tasks);
      }
    });
    return () => subscription.unsubscribe();
  }, [activeTaskCount, myUid, _setActiveTaskCount, theirUid]);

  return helpfulTasks;
};

const ToDoList = ({
  myUid,
  theirUid,
  handleAddingTask,
  activeTaskCount,
  _setActiveTaskCount,
}) => {
  const [task, setTask] = React.useState('');

  const helpfulTasks = useFetchCollection(
    myUid,
    theirUid,
    activeTaskCount,
    _setActiveTaskCount
  );

  const markComplete = (taskId, _myUid, _theirUid) => {
    handleCompleteTask(taskId, _myUid, _theirUid).catch(error =>
      toast$.next({ type: 'ERROR', message: error.message || error })
    );
  };

  return (
    <div className="center pl4 pt2">
      <form
        className=""
        onSubmit={e => {
          e.stopPropagation();
          e.preventDefault();
          console.log({ task });
          handleAddingTask(task, myUid, theirUid);
          setTask('');
        }}
      >
        <fieldset id="help" className="ba b--transparent ph0 mh0">
          <legend className="ph0 mh0 fw6 clip"></legend>
          <div className="mb3">
            <label className="db fw4 lh-copy f6 " htmlFor="task">
              <span className="b">Ways you can help</span>
              <input
                className="b pa2 input-reset ba bg-transparent center br2 b--black-20"
                placeholder="Add a new task..."
                type="text"
                name="task"
                id="task"
                value={task}
                onChange={e => setTask(e.target.value)}
              />
            </label>
          </div>
        </fieldset>
      </form>

      {helpfulTasks &&
        helpfulTasks.map(({ name, taskId, dateCompleted }) => (
          <HelpfulTask
            taskId={taskId}
            name={name}
            dateCompleted={dateCompleted}
            markComplete={markComplete}
            myUid={myUid}
            theirUid={theirUid}
            _handleDeleteTask={handleDeleteTask}
          />
        ))}
    </div>
  );
};

ToDoList.propTypes = propTypes;
ToDoList.defaultProps = defaultProps;

const helpfulTaskPropTypes = {
  taskId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  dateCompleted: PropTypes.string.isRequired,
  markComplete: PropTypes.func.isRequired,
  myUid: PropTypes.string.isRequired,
  theirUid: PropTypes.string.isRequired,
  _handleDeleteTask: PropTypes.func.isRequired,
};
const helpfulTaskDefaultProps = {};

function HelpfulTask({
  taskId,
  name,
  dateCompleted,
  markComplete,
  myUid,
  theirUid,
  _handleDeleteTask,
}) {
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  return (
    <div className="flex items-center mb2" key={taskId}>
      <label htmlFor={name} className="lh-copy">
        <input
          className="mr2"
          type="checkbox"
          id={name}
          value={name}
          checked={!!dateCompleted}
          onChange={() => markComplete(taskId, myUid, theirUid)}
        />
        <span className={!!dateCompleted && 'strike'}>{name}</span>{' '}
      </label>
      <span className="dib">
        {confirmDelete ? (
          <button
            className="f6 underline small-caps bn pointer red"
            type="button"
            onClick={() => _handleDeleteTask(taskId, myUid, theirUid)}
          >
            Confirm Delete
          </button>
        ) : (
          <button
            className="f6 underline small-caps bn pointer black-70"
            type="button"
            onClick={() => setConfirmDelete(true)}
          >
            (Delete)
          </button>
        )}
      </span>
    </div>
  );
}

HelpfulTask.propTypes = helpfulTaskPropTypes;
HelpfulTask.defaultProps = helpfulTaskDefaultProps;
