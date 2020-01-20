import React from 'react';
import PropTypes from 'prop-types';

export const confirmDeletePropTypes = {
  handleDelete: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  activeTaskCount: PropTypes.number.isRequired,
};
export const confirmDeleteDefaultProps = {};

export const ConfirmDelete = ({
  handleDelete,
  title,
  activeTaskCount,
  className,
  testid,
}) => {
  console.log({ activeTaskCount });

  const [confirmDelete, setConfirmDelete] = React.useState(false);
  return (
    <div>
      {confirmDelete ? (
        <Confirmation
          title={title}
          handleDelete={handleDelete}
          setConfirmDelete={setConfirmDelete}
          activeTaskCount={activeTaskCount}
        />
      ) : (
        <button
          className={className}
          type="button"
          onClick={() => setConfirmDelete(true)}
          data-testid={testid}
        >
          {`Delete ${title}`}
        </button>
      )}
    </div>
  );
};
ConfirmDelete.propTypes = confirmDeletePropTypes;
ConfirmDelete.defaultProps = confirmDeleteDefaultProps;

const confirmationPropTypes = {
  title: PropTypes.string.isRequired,
  handleDelete: PropTypes.func.isRequired,
  setConfirmDelete: PropTypes.func.isRequired,
  activeTaskCount: PropTypes.number.isRequired,
};

const confirmationDefaultProps = {};

function Confirmation({
  title,
  handleDelete,
  setConfirmDelete,
  activeTaskCount,
}) {
  if (activeTaskCount.length) {
    return (
      <small className="f6 black-70 small-caps" data-testid="deleteGuard">
        You must complete or remove all active tasks before you can delete this
        contact.
      </small>
    );
  }
  return (
    <div>
      {/* <small className="f6 black-70 small-caps">
        {`Are you sure you want to delete ${title} ?`}
      </small> */}
      <div className="mv3">
        <button
          className="f6 red small-caps pointer link dim ba bw1 ph3 pv2 mb2 dib b--red"
          type="button"
          onClick={handleDelete}
          data-testid="confirmDeleteContact"
        >
          {`Confirm Delete ${title}`}
        </button>
        <button
          className="f6 small-caps bn pointer ml3 black-70"
          type="button"
          onClick={() => {
            setConfirmDelete(false);
          }}
          data-testid="nevermindContactDelete"
        >
          Nevermind
        </button>
      </div>
    </div>
  );
}

Confirmation.propTypes = confirmationPropTypes;
Confirmation.defaultProps = confirmationDefaultProps;
