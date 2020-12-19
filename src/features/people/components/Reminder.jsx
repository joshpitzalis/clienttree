import React from 'react'
import { useSelector } from 'react-redux'
import { Datepicker, DatepickerContainer } from '@duik/it'
import format from 'date-fns/format'
import Loader from 'react-loader-spinner'
import { useImmerReducer } from 'use-immer'
import firebase from '../../../utils/firebase'

import { updateDashboardState } from '../peopleAPI/contactsAPI'

// checkout ./NewReminderModal for a possible revamp
function actions (draft, action) {
  switch (action.type) {
    case 'FORM_SUBMITTED':
      draft.submitting = true
      break
    case 'FORM_ERRORED':
      draft.submitting = false
      draft.error = action.payload
      break
    case 'FORM_RESET':
      draft.task = ''
      draft.submitting = false
      break
    case 'FIELD_UPDATED':
      draft.error = ''
      draft[action.payload.type] = action.payload.value
      break
  }
}
/* eslint-disable react/prop-types */
export const ReminderCreator = ({
  myUid,
  theirUid,
  handleAddingTask,
  newContact,
  photoURL,
  onClose
}) => {
  // if you have the contacts uid then prefill the name field and disable it
  const contact = useSelector(
    store =>
      store.contacts && store.contacts.find(person => person.uid === theirUid)
  )

  const [state, dispatch] = useImmerReducer(actions, {
    name: contact ? contact.name : '',
    task: '',
    date: +new Date() + 604800000,
    error: '',
    submitting: false,
    email: contact ? contact.email : ''
  })

  const handleAddReminder = async (contactName, taskName, dueDate) => {
    dispatch({ type: 'FORM_SUBMITTED' })

    if (!taskName) {
      dispatch({ type: 'FORM_ERRORED', payload: 'You must enter a task.' })
      return
    }
    if (!contactName) {
      dispatch({ type: 'FORM_ERRORED', payload: 'You must enter a contact name.' })
      return
    }
    if (!dueDate) {
      dispatch({ type: 'FORM_ERRORED', payload: 'You must enter a due date.' })
      return
    }

    if (newContact) {
      await firebase
        .firestore()
        .collection('users')
        .doc(myUid)
        .collection('contacts')
        .doc(theirUid)
        .set({
          uid: myUid,
          name: contactName,
          email: '',
          photoURL: `https://ui-avatars.com/api/?name=${contactName}`,
          notes: { },
          tracked: true,
          lastContacted: +new Date()
        }).then(() =>
          updateDashboardState(
            myUid,
            true,
            theirUid,
            contactName,
          `https://ui-avatars.com/api/?name=${contactName}`
          )
        )
    }

    await handleAddingTask({
      taskName,
      myUid,
      theirUid,
      photoURL: `https://ui-avatars.com/api/?name=${contactName}`,
      dueDate,
      contactName,
      email: state.email
    })

    dispatch({ type: 'FORM_RESET' })
    onClose()
  }

  return (
    <div className='center pt3 pb4'>
      <form
        className=''
        onSubmit={e => {
          e.stopPropagation()
          e.preventDefault()
          handleAddReminder(state.name, state.task, state.date)
        }}
      >
        <fieldset
          id='help'
          className='ba b--transparent ph0 mh0'
          data-testid='reminderBox'
        >
          {/* <legend className='ph0 mh0 fw6 '>Follow up with...</legend> */}
          <div className=''>
            <label className='db fw4 lh-copy f6 ' htmlFor='name'>
              <input
                className='db border-box hover-black w-100 measure-narrow ba b--black-20 pa3 br2 mb2'
                placeholder='Who?'
                type='text'
                name='name'
                id='name'
                value={state.name}
                onChange={e => dispatch({ type: 'FIELD_UPDATED', payload: { value: e.target.value, type: 'name' } })}
              />
            </label>
          </div>
          <div className=''>
            <label className='db fw4 lh-copy f6 ' htmlFor='task'>
              {/* <span className="db b">Ways you can help this person</span> */}
              <input
                className='db border-box hover-black w-100 measure-narrow ba b--black-20 pa3 br2 mb2 '
                placeholder='Action?'
                type='text'
                name='task'
                id='task'
                value={state.task}
                onChange={e => {
                  dispatch({ type: 'FIELD_UPDATED', payload: { value: e.target.value, type: 'task' } })
                }}
              />
            </label>
          </div>
          <div className='mb2 center'>
            <DateBox date={state.date} dispatch={dispatch} />
          </div>
          {state.error && <small className='red center db mb3'> {state.error}</small>}

          <button type='submit' className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-700 hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-700 transition duration-150 ease-in-out'>
            {state.submitting && <Loader
              type='Oval'
              color='#FFF'
              height={20}
              width={20}
            />}
            <span className='pl-2'>
              {state.submitting ? 'Submitting...' : 'Create Reminder'}
            </span>
          </button>
        </fieldset>
      </form>
    </div>
  )
}

function DateBox ({ date, dispatch }) {
  const [visible, setVisible] = React.useState(false)

  return visible ? (
    <DatepickerContainer>
      <Datepicker
        value={new Date(date + 86400)}
        onDateChange={value => {
          dispatch({ type: 'FIELD_UPDATED', payload: { value: +new Date(value), type: 'date' } })
          setVisible(false)
        }}
        minDate={new Date()}
      />
    </DatepickerContainer>
  ) : (
    <label className='db fw4 lh-copy f6 ' htmlFor='date'>
      <input
        className='border-gray-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300  appearance-none rounded-md relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:z-10 sm:text-sm sm:leading-5'
        placeholder='When?'
        type='text'
        name='date'
        id='date'
        onClick={() => setVisible(true)}
        value={format(date, 'EEEE do MMMM yyyy')}
      />
    </label>
  )
}
