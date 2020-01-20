import React from 'react';
import { TextArea } from '@duik/it';
import { Icon } from 'antd';
// import PropTypes from 'prop-types';
import { debounceTime, filter, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

const events$ = new Subject();

export const EditBox = ({ note, notes, setActiveNote, setState, state }) => {
  const { text, lastUpdated, id } = note;

  const [message, setMessage] = React.useState(text);

  React.useEffect(() => {
    const subscription = events$
      .pipe(
        filter(event => event.type === 'people/updateNotesTextarea'),
        debounceTime(1000)
      )
      .subscribe(action => {
        const newTimestamp = +new Date();
        const newId = id === 9007199254740991 ? newTimestamp : id;
        setState(prevState => ({
          ...prevState,
          notes: {
            [newId]: {
              id: newId,
              text: action.payload,
              lastUpdated: id === 9007199254740991 ? newTimestamp : lastUpdated,
            },
            ...prevState.notes,
          },
        }));

        return setActiveNote(newId);
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
          setMessage(value);
          setState(prevState => ({ ...prevState, saving: true }));
          events$.next({
            type: 'people/updateNotesTextarea',
            payload: value,
          });
        }}
        value={message}
      />
      {/* {note.id !== 9007199254740991 && (
        <div className="flex justify-between items-start mt0 pa0 mb3">
          <Icon
            className="o-50"
            type="delete"
            style={{
              color: 'red',
            }}
          />
        </div>
      )} */}
    </div>
  );
};

// EditBox.propTypes = {
//   note: PropTypes.shape({
//     id: PropTypes.number,
//     text: PropTypes.string,
//     lastUpdated: PropTypes.number,
//   }).isRequired,
//   notes: PropTypes.any,
//   setActiveNote: PropTypes.func.isRequired,
//   setState: PropTypes.func.isRequired,
// };

// EditBox.defaultProps = {
//   notes: {
//     1: {
//       id: 1,
//       text: '',
//       lastUpdated: +new Date(),
//     },
//   },
// };
