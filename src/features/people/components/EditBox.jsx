import React from 'react';
import { TextArea } from '@duik/it';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { debounceTime, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';

const events$ = new Subject();

export const EditBox = ({ note, notes, setActiveNote, setState }) => {
  const { text, lastUpdated, id } = note;

  const [message, setMessage] = React.useState(text);

  React.useEffect(() => {
    const subscription = events$
      .pipe(
        filter(event => event.type === 'people/updateNotesTextarea'),
        debounceTime(2000)
      )
      .subscribe(action => {
        console.log({ action });
        const newTimestamp = +new Date();
        const newId = id === 1 ? newTimestamp : id;
        setState(prevState => ({
          ...prevState,
          notes: {
            ...prevState.notes,
            [newId]: {
              id: newId,
              text: action.payload,
              lastUpdated: id === 1 ? newTimestamp : lastUpdated,
            },
          },
        }));

        setActiveNote(newId);
      });
    return () => subscription.unsubscribe();
  }, [id, lastUpdated, notes, setActiveNote, setState]);

  return (
    <div>
      <TextArea
        placeholder="Click to edit..."
        rows={10}
        aria-label="note"
        className="mb0"
        data-testid="notesTextarea"
        onChange={event => {
          const { value } = event.target;
          // setSaving(true);
          setState(prevState => ({ ...prevState, saving: true }));
          setMessage(value);
          events$.next({
            type: 'people/updateNotesTextarea',
            payload: value,
          });
        }}
        value={message}
      />
      {note.id !== 1 && (
        <div className="flex justify-between items-start mt0 pa0 mb3">
          <Icon
            className="o-50"
            type="delete"
            style={{
              color: 'red',
            }}
          />
        </div>
      )}
    </div>
  );
};

EditBox.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.number,
    text: PropTypes.string,
    lastUpdated: PropTypes.number,
  }).isRequired,
  notes: PropTypes.any,
  setActiveNote: PropTypes.func.isRequired,
  setState: PropTypes.func.isRequired,
};

EditBox.defaultProps = {
  notes: {
    1: {
      id: 1,
      text: '',
      lastUpdated: +new Date(),
    },
  },
};
