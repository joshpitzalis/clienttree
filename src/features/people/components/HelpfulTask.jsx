import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { ACTIVITY_COMPLETED } from '../networkConstants';
import { ONBOARDING_STEP_COMPLETED } from '../../onboarding/onboardingConstants';

const helpfulTaskPropTypes = {
  taskId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  dateCompleted: PropTypes.string,
  myUid: PropTypes.string.isRequired,
  theirUid: PropTypes.string.isRequired,
  _handleDeleteTask: PropTypes.func.isRequired,
};
const helpfulTaskDefaultProps = {
  dateCompleted: null,
};

export function HelpfulTask({
  taskId,
  name,
  dateCompleted,
  myUid,
  theirUid,
  _handleDeleteTask,
}) {
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const dispatch = useDispatch();
  return (
    <div className="flex items-baseline mb2 lh-copy">
      <label htmlFor={name} className="pr2">
        <input
          className="mr2"
          type="checkbox"
          id={name}
          value={name}
          checked={!!dateCompleted}
          onChange={() => {
            dispatch({
              type: ACTIVITY_COMPLETED,
              payload: {
                taskId,
                myUid,
                completedFor: theirUid,
                checked: !!dateCompleted,
                setSelectedUser: () => {},
                setVisibility: () => {},
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
        <span className={dateCompleted ? 'strike' : null}>{name}</span>
      </label>

      {confirmDelete ? (
        <button
          className="f6 underline small-caps bn pointer red "
          type="button"
          onClick={() => _handleDeleteTask(taskId, myUid, theirUid)}
        >
          Confirm Delete
        </button>
      ) : (
        <button
          className="f6 underline small-caps bn pointer black-70 "
          type="button"
          onClick={() => setConfirmDelete(true)}
        >
          (Delete)
        </button>
      )}
    </div>
  );
}
HelpfulTask.propTypes = helpfulTaskPropTypes;
HelpfulTask.defaultProps = helpfulTaskDefaultProps;
