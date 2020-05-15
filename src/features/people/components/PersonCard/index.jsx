import { firstLastInitial } from './helpers'
import React, { useState } from 'react'
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
import { handleTracking } from '../../peopleAPI'
import { toast$ } from '../../../notifications/toast'

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

    case 'note/deleted':
      delete draft.notes[action.payload]
      break

    case 'contact/workboardToggle':
      draft.tracked = !draft.tracked
      break
  }
}

/* eslint-disable react/prop-types */
export const PersonCard = ({ setVisibility, userId, contact, tracked }) => {
  const [state, dispatch] = useImmerReducer(actions, {
    ...contact,
    userId,
    uid: contact.uid || '',
    name: contact.name || '',
    email: contact.email || '',
    photoURL: contact.photoURL || 'https://ui-avatars.com/api/?name=ct',
    notes: contact.notes || {
      9007199254740991: {
        id: 9007199254740991,
        text: '',
        lastUpdated: 9007199254740991
      }
    },
    tracked: contact.tracked || false,
    lastContacted: +new Date()
  })

  const [errors, setErrors] = useState({})

  const onSubmit = () => {
    if (!state.name) {
      setErrors({ ...errors, name: 'A name is required.' })
      return
    }

    const newDoc = firebase
      .firestore()
      .collection('users')
      .doc(userId)
      .collection('contacts')
      .doc()
    const uid = state.uid || newDoc.id

    try {
      firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('contacts')
        .doc(uid)
        .set({
          ...state,
          lastContacted: +new Date(),
          uid
        })
        .then(() => {
          if (state.tracked !== contact.tracked) {
            return handleTracking(
              state.tracked,
              state.userId,
              uid,
              state.name,
              state.photoURL
            )
          }
        })
        .then(() => setVisibility(false))
    } catch (error) {
      toast$.next({ type: 'ERROR', message: error.message || error })
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
        <HeaderRow newCard={!state.uid}/>
        <form
          className="px-4 py-5 sm:p-0"
          onSubmit={e => {
            e.preventDefault()
            onSubmit()
          }}>
          <dl>
            <ImageRow dispatch={dispatch} image={state.photoURL} />
            <NameRow dispatch={dispatch} name={state.name} errors={errors} setErrors={setErrors}/>
            <EmailRow dispatch={dispatch} email={state.email}/>
            <WorkboardRow tracked={state.tracked} dispatch={dispatch} />
            <InteractionsRow
              notes={
                Object
                  .values(state.notes)
                  .filter(({ id }) => id !== 9007199254740991)
              }
              dispatch={dispatch}/>
            <FooterButtons
              contactId={state.uid && state.uid}
              userId={userId}
              setVisibility={setVisibility}
              onSubmit={onSubmit}
              newCard={!state.uid}
              tracked={contact.tracked}/>
          </dl>
        </form>
      </div>
    </ErrorBoundary>)
}
