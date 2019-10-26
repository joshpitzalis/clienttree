import React from 'react';
import PropTypes from 'prop-types';
import { collection } from 'rxfire/firestore';
import { map } from 'rxjs/operators';
import { useDispatch } from 'react-redux';
import { ACTIVITY_COMPLETED } from '../networkConstants';
import firebase from '../../../utils/firebase';
import { Modal } from './ContactModal';
import Portal from '../../../utils/Portal';
import { ONBOARDING_STEP_COMPLETED } from '../../onboarding/onboardingConstants';

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
        helpfulTasks.map(
          ({ taskId, name, dateCompleted, completedFor, photoURL }) =>
            completedFor && (
              <TaskDetails
                taskId={taskId}
                name={name}
                dateCompleted={dateCompleted}
                myUid={myUid}
                completedFor={completedFor}
                setSelectedUser={setSelectedUser}
                setVisibility={setVisibility}
                photoURL={photoURL}
              />
            )
        )}
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
  photoURL: PropTypes.string.isRequired,
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
  photoURL,
}) {
  const dispatch = useDispatch();
  return (
    <div className="flex items-center mb2" key={taskId}>
      <label htmlFor={name} className="lh-copy flex items-center">
        <input
          className="mr2"
          type="checkbox"
          id={name}
          value={name}
          checked={dateCompleted}
          onChange={() => {
            dispatch({
              type: ACTIVITY_COMPLETED,
              payload: {
                taskId,
                myUid,
                completedFor,
                setSelectedUser,
                setVisibility,
              },
            });
            dispatch({
              type: ONBOARDING_STEP_COMPLETED,
              payload: {
                userId: myUid,
                onboardingStep: 'helpedSomeone',
              },
            });
          }}
        />
        <small className={`w-100 ${dateCompleted && 'strike'}`}>{name}</small>
        {photoURL && <img src={photoURL} alt={name} height="25" />}
      </label>
    </div>
  );
}

TaskDetails.propTypes = propTypes;
TaskDetails.defaultProps = defaultProps;
