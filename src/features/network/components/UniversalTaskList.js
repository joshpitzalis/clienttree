import React from 'react';
import PropTypes from 'prop-types';
import { collection } from 'rxfire/firestore';
import { map } from 'rxjs/operators';

import { handleCompleteTask } from '../networkAPI';
import firebase from '../../../utils/firebase';
import { Modal } from './ContactModal';
import Portal from '../../../utils/Portal';

const helpfulPropTypes = {
  myUid: PropTypes.string.isRequired,
};
const helpfulDefaultProps = {};

export const HelpfulTaskList = ({ myUid }) => {
  const [helpfulTasks, setHelpfulTasks] = React.useState([]);
  React.useEffect(() => {
    const subscription = collection(
      firebase
        .firestore()
        .collectionGroup('helpfulTasks')
        .where('connectedTo', '==', myUid)
        .where('dateCompleted', '==', null)
    )
      .pipe(map(docs => docs.map(d => d.data())))
      .subscribe(tasks => tasks && setHelpfulTasks(tasks));
    return () => subscription.unsubscribe();
  }, [myUid]);

  const [visible, setVisibility] = React.useState(false);

  const [selectedUser, setSelectedUser] = React.useState('');

  return (
    <div>
      {visible && (
        <Portal
          onClose={() => {
            setVisibility(false);
            setSelectedUser('');
          }}
        >
          <Modal
            setVisibility={setVisibility}
            uid={myUid}
            selectedUserUid={selectedUser}
            onClose={() => {
              setVisibility(false);
              setSelectedUser('');
            }}
          />
        </Portal>
      )}

      {helpfulTasks &&
        helpfulTasks.map(({ taskId, name, dateCompleted, completedFor }) => (
          <TaskDetails
            taskId={taskId}
            name={name}
            dateCompleted={dateCompleted}
            handleCompleteTask={handleCompleteTask}
            myUid={myUid}
            completedFor={completedFor}
            setSelectedUser={setSelectedUser}
            setVisibility={setVisibility}
          />
        ))}
    </div>
  );
};

HelpfulTaskList.propTypes = helpfulPropTypes;
HelpfulTaskList.defaultProps = helpfulDefaultProps;

const propTypes = {
  taskId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  dateCompleted: PropTypes.string.isRequired,
  myUid: PropTypes.string.isRequired,
  completedFor: PropTypes.string.isRequired,
  setSelectedUser: PropTypes.func.isRequired,
  setVisibility: PropTypes.func.isRequired,
};
const defaultProps = {};

function TaskDetails({
  taskId,
  name,
  dateCompleted,
  myUid,
  completedFor,
  setSelectedUser,
  setVisibility,
}) {
  return (
    <div className="flex items-center mb2" key={taskId}>
      <label htmlFor={name} className="lh-copy">
        <input
          className="mr2"
          type="checkbox"
          id={name}
          value={name}
          checked={dateCompleted}
          onChange={async () => {
            const numberofActiveTasks = await firebase
              .firestore()
              .collection('users')
              .doc(myUid)
              .collection('contacts')
              .doc(completedFor)
              .collection('helpfulTasks')
              .get()
              .then(coll => coll.docs.map(doc => doc.data()))
              .then(coll => coll.filter(task => !task.dateCompleted))
              .then(coll => coll.length);

            handleCompleteTask(taskId, myUid, completedFor);

            if (numberofActiveTasks === 1) {
              setSelectedUser(completedFor);
              setVisibility(true);
            }
          }}
        />
        <small className={dateCompleted && 'strike'}>{name}</small>
      </label>
    </div>
  );
}

TaskDetails.propTypes = propTypes;
TaskDetails.defaultProps = defaultProps;
