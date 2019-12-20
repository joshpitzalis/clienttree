import React from 'react';
import { collectionData } from 'rxfire/firestore';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { handleDeleteTask } from '../peopleAPI';
import firebase from '../../../utils/firebase';
import { taskSlice } from '../taskSlice';
import { HelpfulTask } from './HelpfulTask';

export const propTypes = {
  myUid: PropTypes.string.isRequired,
  theirUid: PropTypes.string.isRequired,
  handleAddingTask: PropTypes.func.isRequired,
  activeTaskCount: PropTypes.number.isRequired,
  _setActiveTaskCount: PropTypes.func.isRequired,
  photoURL: PropTypes.string.isRequired,
};
export const defaultProps = {};

export const ToDoList = ({
  myUid,
  theirUid,
  handleAddingTask,
  activeTaskCount,
  _setActiveTaskCount,
  photoURL,
}) => {
  const [task, setTask] = React.useState('');
  const { actions } = taskSlice;
  const { setTasks } = actions;
  const dispatch = useDispatch();

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
      const newActiveTaskCount = tasks.filter(_task => !_task.dateCompleted)
        .length;
      if (activeTaskCount !== newActiveTaskCount) {
        _setActiveTaskCount(myUid, theirUid, newActiveTaskCount);
      }
      const newTasks = tasks.map(_task => ({
        ..._task,
        dateCreated: _task.dateCreated.nanoseconds,
      }));
      dispatch(setTasks({ tasks: newTasks, theirUid }));
    });
    return () => subscription.unsubscribe();
  }, [
    activeTaskCount,
    myUid,
    _setActiveTaskCount,
    theirUid,
    dispatch,
    setTasks,
  ]);
  const helpfulTasks = useSelector(state => state.tasks[theirUid]);

  return (
    <div className="center pl4 pt2">
      <form
        className=""
        onSubmit={e => {
          e.stopPropagation();
          e.preventDefault();
          handleAddingTask(task, myUid, theirUid, photoURL);
          setTask('');
        }}
      >
        <fieldset id="help" className="ba b--transparent ph0 mh0">
          <legend className="ph0 mh0 fw6 clip"></legend>
          <div className="mb3">
            <label className="db fw4 lh-copy f6 " htmlFor="task">
              {/* <span className="db b">Ways you can help this person</span> */}
              <input
                className="db border-box hover-black w-100 measure-narrow ba b--black-20 pa2 br2 mb2 mt4"
                placeholder="Add a way you can help this person..."
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
        !helpfulTasks.filter(_task => !_task.dateCompleted).length && (
          <small className="red">
            We recommend always having atleast one active task per contact. That
            way there is always some small way to move forward. Please add a
            task before closing.
          </small>
        )}

      {helpfulTasks &&
        helpfulTasks.map(({ name, taskId, dateCompleted }) => (
          <HelpfulTask
            key={taskId}
            taskId={taskId}
            name={name}
            dateCompleted={dateCompleted}
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
