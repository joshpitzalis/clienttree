import React from 'react';
import PropTypes from 'prop-types';

export const confirmDeletePropTypes = {
  handleDelete: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
export const confirmDeleteDefaultProps = {};

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
