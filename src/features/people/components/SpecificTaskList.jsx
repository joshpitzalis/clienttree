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

/** @param {{myUid: string, contactSelected: string }} [Props] */

export const SpecificTaskList = ({ myUid, contactSelected }) => {
  const [helpfulTasks, setHelpfulTasks] = React.useState([]);

  React.useEffect(() => {
    const subscription = collection(
      firebase
        .firestore()
        .collection('users')
        .doc(myUid)
        .collection('contacts')
        .doc(contactSelected)
        .collection('helpfulTasks')
    )
      .pipe(map(docs => docs.map(d => d.data())))
      .subscribe(tasks => tasks && setHelpfulTasks(tasks));
    return () => subscription.unsubscribe();
  }, [contactSelected, myUid]);

  const [visible, setVisibility] = React.useState(false);

  const [selectedUser, setSelectedUser] = React.useState('');

  return (
    <div data-testid="specificTaskList">
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
                key={taskId}
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

const propTypes = {
  taskId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  dateCompleted: PropTypes.string,
  myUid: PropTypes.string.isRequired,
  completedFor: PropTypes.string.isRequired,
  setSelectedUser: PropTypes.func.isRequired,
  setVisibility: PropTypes.func.isRequired,
  photoURL: PropTypes.string.isRequired,
};
const defaultProps = {
  dateCompleted: undefined,
};

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
    <div className="flex items-baseline mb2" key={taskId}>
      <label htmlFor={name} className="lh-copy flex items-baseline">
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
        <p className={`w-100 pr2 ${dateCompleted && 'strike'}`}>{name}</p>
        <img src={photoURL} alt={name} height="25" className=" br-100" />
      </label>
    </div>
  );
}

TaskDetails.propTypes = propTypes;
TaskDetails.defaultProps = defaultProps;
