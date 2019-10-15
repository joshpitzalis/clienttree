import React from 'react';
import PropTypes from 'prop-types';

export const propTypes = {
  myUid: PropTypes.string.isRequired,
  theirUid: PropTypes.string.isRequired,
  handleAddingTask: PropTypes.func.isRequired,
  activeTaskCount: PropTypes.number.isRequired,
  _setActiveTaskCount: PropTypes.func.isRequired,
};
export const defaultProps = {};
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
export function HelpfulTask({
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
    <div className="flex items-center mb2">
      <label htmlFor={name} className="lh-copy dib">
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
