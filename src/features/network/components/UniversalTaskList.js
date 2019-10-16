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
          <div className="flex items-center mb2" key={taskId}>
            <label htmlFor={name} className="lh-copy">
              <input
                className="mr2"
                type="checkbox"
                id={name}
                value={name}
                checked={dateCompleted}
                onChange={() => {
                  handleCompleteTask(taskId, myUid, completedFor);
                  setSelectedUser(completedFor);
                  setVisibility(true);
                }}
              />
              <small className={dateCompleted && 'strike'}>{name}</small>
            </label>
          </div>
        ))}
    </div>
  );
};
HelpfulTaskList.propTypes = helpfulPropTypes;
HelpfulTaskList.defaultProps = helpfulDefaultProps;
