import React from 'react';
import { collectionData } from 'rxfire/firestore';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { toast$ } from '../notifications/toast';
import { handleDeleteTask, handleCompleteTask } from './networkAPI';
import firebase from '../../utils/firebase';
import { taskSlice } from './taskSlice';
import { HelpfulTask } from './HelpfulTask';
// const useFetchCollection = (
//   myUid,
//   theirUid,
//   activeTaskCount,
//   _setActiveTaskCount,
//   dispatch,
//   setTasks
// ) => {
//   const [helpfulTasks, setHelpfulTasks] = React.useState([]);
//   React.useEffect(() => {
//     const subscription = collectionData(
//       firebase
//         .firestore()
//         .collection('users')
//         .doc(myUid)
//         .collection('contacts')
//         .doc(theirUid)
//         .collection('helpfulTasks')
//     ).subscribe(tasks => {
//       if (tasks && tasks.length) {
//         const newActiveTaskCount = tasks.filter(task => !task.dateCompleted)
//           .length;
//         if (activeTaskCount !== newActiveTaskCount) {
//           _setActiveTaskCount(myUid, theirUid, newActiveTaskCount);
//         }
//         dispatch(setTasks({ tasks, theirUid }));
//         setHelpfulTasks(tasks);
//       }
//     });
//     return () => subscription.unsubscribe();
//   }, [
//     activeTaskCount,
//     myUid,
//     _setActiveTaskCount,
//     theirUid,
//     dispatch,
//     setTasks,
//   ]);
//   return helpfulTasks;
// };

export const propTypes = {
  myUid: PropTypes.string.isRequired,
  theirUid: PropTypes.string.isRequired,
  handleAddingTask: PropTypes.func.isRequired,
  activeTaskCount: PropTypes.number.isRequired,
  _setActiveTaskCount: PropTypes.func.isRequired,
};
export const defaultProps = {};

export const ToDoList = ({
  myUid,
  theirUid,
  handleAddingTask,
  activeTaskCount,
  _setActiveTaskCount,
}) => {
  const [task, setTask] = React.useState('');
  const { actions } = taskSlice;
  const { setTasks } = actions;
  const dispatch = useDispatch();
  // const helpfulTasks = useFetchCollection(
  //   myUid,
  //   theirUid,
  //   activeTaskCount,
  //   _setActiveTaskCount,
  //   dispatch,
  //   setTasks
  // );
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
        const newActiveTaskCount = tasks.filter(_task => !_task.dateCompleted)
          .length;
        if (activeTaskCount !== newActiveTaskCount) {
          _setActiveTaskCount(myUid, theirUid, newActiveTaskCount);
        }
        dispatch(setTasks({ tasks, theirUid }));
      }
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
  const markComplete = (taskId, _myUid, _theirUid) => {
    handleCompleteTask(taskId, _myUid, _theirUid)
      .then(() => {
        const { analytics } = window;
        analytics.track('Helped Someone');
      })
      .catch(error =>
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
            key={taskId}
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
