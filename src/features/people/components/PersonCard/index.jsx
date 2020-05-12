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
  }
}
/* eslint-disable react/prop-types */
export const PersonCard = ({ setVisibility, newPerson, userId }) => {
  const [state, dispatch] = useImmerReducer(actions, {
    errors: {
    },
    image: 'https://ui-avatars.com/api/?name=ct',
    name: ''
  })

  const onSubmit = () => {
    console.log('submited...')

    const newDoc = firebase
      .firestore()
      .collection('users')
      .doc(userId)
      .collection('contacts')
      .doc()
    console.log(newDoc.id)
    try {
      console.log('saving to fb')
      console.log({ ...state, userId })

      firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('contacts')
        .doc(newDoc.id)
        .set({
          name: state.name,
          // summary,
          uid: newDoc.id,
          lastContacted: +new Date(),
          photoURL: state.image
        // activeTaskCount: 1,
        // notes,
        // email
        }).then(() => setVisibility(false))
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
            <ImageRow dispatch={dispatch} image={state.image} />
            <NameRow dispatch={dispatch} name={state.name}/>
            <EmailRow />
            <WorkboardRow />
            <InteractionsRow />
            <FooterButtons
              setVisibility={setVisibility}
              onSubmit={onSubmit}
              newCard={newPerson}/>
          </dl>
        </form>
      </div>
    </ErrorBoundary>)
}
