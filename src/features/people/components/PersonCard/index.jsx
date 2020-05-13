import { firstLastInitial } from './helpers'
import React from 'react'
import { useImmerReducer } from 'use-immer'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from './ErrorFallback'
import { ImageRow } from './ImageRow'
import { NameRow } from './NameRow'
import { HeaderRow } from './HeaderRow'
import { EmailRow } from './EmailRow'
import { WorkboardRow } from './WorkboardRow'
import { InteractionsRow } from './InteractionsRow'
import { FooterButtons } from './FooterButtons'
import firebase from '../../../../utils/firebase'

function actions (draft, action) {
  switch (action.type) {
    case 'IMAGE_UPLOADED':
      draft.image = action.payload
      break

    case 'IMAGE_ERRORED':
      draft.errors = { ...draft.errors, image: action.payload }
      break

    case 'NAME_UPDATED':
      draft.name = action.payload
      draft.image = `https://ui-avatars.com/api/?name=${firstLastInitial(action.payload)}`
      break

    case 'EMAIL_UPDATED':
      draft.email = action.payload
      break

    case 'NEW_NOTE_SUBMITTED':
      draft.notes[action.payload.id] = action.payload
      break
  }
}

// {
//   userId,
//   uid: contactId,
//   name: generateName(),
//   photoURL: null,
//   notes: {
//     9007199254740991: {
//       id: 9007199254740991,
//       text: '',
//       lastUpdated: 9007199254740991
//     }
//   },
//   lastContacted: +new Date(oneYearAgo),
//   tracked: false,
//   saving: null,
//   email: '',
//   ...contact
// }

/* eslint-disable react/prop-types */
export const PersonCard = ({ setVisibility, newPerson, userId, contact }) => {
  const [state, dispatch] = useImmerReducer(actions, {
    errors: {
    },
    uid: contact.uid || '',
    photoURL: contact.photoURL || 'https://ui-avatars.com/api/?name=ct',
    name: contact.name || '',
    email: contact.email || '',
    notes: contact.notes || {
      123: { id: '123', text: 'I am note', lastUpdated: +new Date() },
      234: { id: '234', text: 'I am another note', lastUpdated: +new Date() }
    }
  })

  const onSubmit = () => {
    const newDoc = firebase
      .firestore()
      .collection('users')
      .doc(userId)
      .collection('contacts')
      .doc()

    try {
      firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('contacts')
        .doc(state.uid || newDoc.id)
        .set({
          name: state.name,
          uid: state.uid || newDoc.id,
          lastContacted: +new Date(),
          photoURL: state.photoURL,
          notes: state.notes,
          email: state.email
        }, { merge: true })
        .then(() => setVisibility(false))
    } catch (error) {
      console.error({ error })
    }
  }

  return (
    <ErrorBoundary
      // https://github.com/bvaughn/react-error-boundary
      FallbackComponent={ErrorFallback}
      // onReset={() => { }}
    >
      <div
        className="bg-white shadow overflow-hidden sm:rounded-lg" data-testid='personCard'>
        <HeaderRow newCard={newPerson}/>
        <form className="px-4 py-5 sm:p-0" onSubmit={e => {
          e.preventDefault()
          onSubmit()
        }}>
          <dl>
            <ImageRow dispatch={dispatch} image={state.photoURL} />
            <NameRow dispatch={dispatch} name={state.name}/>
            <EmailRow dispatch={dispatch} email={state.email}/>
            <WorkboardRow />
            <InteractionsRow notes={Object.values(state.notes)} dispatch={dispatch}/>
            <FooterButtons
              setVisibility={setVisibility}
              onSubmit={onSubmit}
              newCard={newPerson}/>
          </dl>
        </form>
      </div>
    </ErrorBoundary>)
}
