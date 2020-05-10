import React from 'react'
import { TextArea } from '@duik/it'
import { Icon } from 'antd'
import { debounceTime, filter } from 'rxjs/operators'
import { Subject } from 'rxjs'

const events$ = new Subject()
/* eslint-disable react/prop-types */
export const EditBox = ({
  note,
  notes,
  setActiveNote,
  setState,
  state,
  theirId,
  myId
}) => {
  const { text, lastUpdated, id } = note

  const [message, setMessage] = React.useState(text)

  React.useEffect(() => {
    const subscription = events$
      .pipe(
        filter(event => event.type === 'people/updateNotesTextarea'),
        debounceTime(1000)
      )
      .subscribe(action => {
        const newTimestamp = +new Date()
        const newId = id === 9007199254740991 ? newTimestamp : id
        setState({
          ...state,
          notes: {
            ...state.notes,
            [newId]: {
              id: newId,
              text: action.payload,
              lastUpdated: id === 9007199254740991 ? newTimestamp : lastUpdated
            }
          }
        })
        setActiveNote(newId)
      })
    return () => subscription.unsubscribe()
  }, [id, lastUpdated, myId, notes, setActiveNote, setState, state, theirId])

  return (
    <div>
      <TextArea
        placeholder='Click to edit...'
        rows={10}
        aria-label='note'
        className='mb0'
        data-testid='notesTextarea'
        onChange={event => {
          const { value } = event.target
          setMessage(value)
          if (!state.saving) {
            setState({ ...state, saving: true })
          }
          events$.next({
            type: 'people/updateNotesTextarea',
            payload: value
          })
        }}
        value={message}
      />
      {note.id !== 9007199254740991 && (
        <DeleteNote
          noteId={note.id}
          setState={setState}
          setActiveNote={setActiveNote}
          state={state}
        />
      )}
    </div>
  )
}

// function deleteReducer(state, action) {
//   switch (action.type) {
//     case 'increment':
//       return { count: state.count + 1 };
//     case 'decrement':
//       return { count: state.count - 1 };
//     default:
//       throw new Error();
//   }
// }

const handleDelete = ({
  setDeleting,
  state,
  noteId,
  setState,
  setActiveNote
}) => {
  // show deleting in progress...
  setDeleting(true)
  // actually delete note
  try {
    const newNotes = { ...state.notes }
    delete newNotes[noteId]
    const newState = { ...state, notes: newNotes, saving: true }
    setState(newState)
    // setActive Note once the existing active note is deleted
    setActiveNote(9007199254740991)
    setDeleting(false)
  } catch (error) {
    // make sure to catch any unforseen errors
    console.error({ error })
    setDeleting(false)
  }
}

function DeleteNote ({ noteId, setState, setActiveNote, state }) {
  const [visible, setVisibility] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  // const [_state, dispatch] = React.useReducer(deleteReducer, {
  //   deleting: false,
  // });

  if (deleting) {
    return (
      <button
        className='f6 red pointer link dim bn ph3 pv2 mb2 dib'
        type='button'
        data-testid='deletingInProcess'
        disabled
      >
        {'Deleting...'}
      </button>
    )
  }

  return visible ? (
    <div>
      <button
        className='f6 red pointer link dim bn ph3 pv2 mb2 dib'
        type='button'
        // data-testid="confirmDeleteContact"
        onClick={() =>
          handleDelete({ setDeleting, state, noteId, setState, setActiveNote })}
      >
        {'Confirm Delete'}
      </button>
      <button
        className='f6  bn pointer ml3 '
        type='button'
        onClick={() => {
          setVisibility(false)
        }}
        // data-testid="nevermindContactDelete"
      >
        Nevermind
      </button>
    </div>
  ) : (
    <div className='flex justify-between items-start mt0 pa0 mb3'>
      <Icon
        data-testid='deleteNote'
        className='o-50'
        type='delete'
        onClick={() => setVisibility(true)}
        style={{
          color: 'red'
        }}
      />
    </div>
  )
}
