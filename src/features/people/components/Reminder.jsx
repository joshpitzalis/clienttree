import React from 'react'
import { useSelector } from 'react-redux'
import { Datepicker, DatepickerContainer } from '@duik/it'
import format from 'date-fns/format'
import Transition from '../../../utils/transition.js'
import Loader from 'react-loader-spinner'

/* eslint-disable react/prop-types */
export const ReminderCreator = ({
  myUid,
  theirUid,
  handleAddingTask,
  photoURL,
  onClose
}) => {
  const contact = useSelector(
    store =>
      store.contacts && store.contacts.find(person => person.uid === theirUid)
  )
  const [email] = React.useState(contact ? contact.email : '')
  const [name, setName] = React.useState(contact && contact.name)
  const [task, setTask] = React.useState('')
  const [date, setDate] = React.useState(+new Date() + 604800000)
  const [error, setError] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)
  // if you have the contacts uid then prefill the name field and disable it
  const handleAddReminder = async (contactName, taskName, dueDate) => {
    setSubmitting(true)
    if (!taskName) {
      setError('You must enter a task')
      setSubmitting(false)
      return
    }

    if (!contactName) {
      setError('You must enter a contact name')
      setSubmitting(false)
      return
    }

    if (!dueDate) {
      setError('You must enter a due date')
      setSubmitting(false)
      return
    }

    await handleAddingTask({
      taskName,
      myUid,
      theirUid,
      photoURL,
      dueDate,
      contactName,
      email
    })
    setSubmitting(false)
    setTask('')
    onClose()
  }

  return (
    <div className="center pt3 pb4">
      <form
        className=""
        onSubmit={e => {
          e.stopPropagation()
          e.preventDefault()
          handleAddReminder(name, task, date)
        }}
      >
        <fieldset
          id="help"
          className="ba b--transparent ph0 mh0"
          data-testid="reminderBox"
        >
          <legend className="ph0 mh0 fw6 ">Follow up with...</legend>
          <div className="">
            <label className="db fw4 lh-copy f6 " htmlFor="name">
              {/* <span className="db b">Ways you can help this person</span> */}
              <input
                disabled
                className="db border-box hover-black w-100 measure-narrow ba b--black-20 pa3 br2 mb2"
                placeholder="Who?"
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </label>
          </div>
          <div className="">
            <label className="db fw4 lh-copy f6 " htmlFor="task">
              {/* <span className="db b">Ways you can help this person</span> */}
              <input
                className="db border-box hover-black w-100 measure-narrow ba b--black-20 pa3 br2 mb2 "
                placeholder="About What?"
                type="text"
                name="task"
                id="task"
                value={task}
                onChange={e => {
                  setError('')
                  setTask(e.target.value)
                }}
              />
            </label>
          </div>
          <div className="mb2 center">
            <DateBox date={date} setDate={setDate} setError={setError} />
          </div>
          {error && <small className="red center db mb3"> {error}</small>}

          <button type='submit' className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-700 hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-700 transition duration-150 ease-in-out'>
            {submitting && <Loader
              type="Oval"
              color="#FFF"
              height={20}
              width={20}
            />}
            <span className="pl-2">
              {submitting ? 'Submitting...' : 'Create Reminder'}</span>
          </button>
        </fieldset>
      </form>
    </div>
  )
}

function DateBox ({ date, setDate, setError }) {
  const [visible, setVisible] = React.useState(false)

  return visible ? (
    <DatepickerContainer>
      <Datepicker
        value={new Date(date + 86400)}
        onDateChange={value => {
          setError('')
          setDate(+new Date(value))
          setVisible(false)
        }}
        minDate={new Date()}
      />
    </DatepickerContainer>
  ) : (
    <label className="db fw4 lh-copy f6 " htmlFor="date">
      <input
        className="border-gray-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300  appearance-none rounded-md relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:z-10 sm:text-sm sm:leading-5"
        placeholder="When?"
        type="text"
        name="date"
        id="date"
        onClick={() => setVisible(true)}
        value={format(date, 'EEEE do MMMM yyyy')}
        onChange={e => setDate(e.target.value)}
      />
    </label>
  )
}

/* eslint-disable react/prop-types */
export const ReminderModal = ({
  showModal,
  toggleModal
}) => {
  const [date, setDate] = React.useState(+new Date() + 604800000)
  const [, setError] = React.useState('')

  return (

    <div className="fixed bottom-0 inset-x-0 px-4 pb-6 sm:inset-0 sm:p-0 sm:flex sm:items-center sm:justify-center z-999">
      <Transition
        show={showModal}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
        </div>
      </Transition>

      <Transition
        show={showModal}
        enter="ease-out duration-300"
        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enterTo="opacity-100 translate-y-0 sm:scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">

        <div className="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all sm:max-w-sm sm:w-full sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-headline">

          <form className='reset'>
            <div>
              <div className="mt-8 ">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Create a reminder...
                  </h3>
                  <p className="mt-1 text-sm leading-5 text-gray-500">
          Follow up with someone about something by a certain date.
                  </p>
                </div>
                <div className="mt-6  ">
                  <div className="">
                    <label htmlFor="first_name" className="block text-sm font-medium leading-5 text-gray-700">
            Name
                    </label>
                    <div className="mt-1 rounded-md shadow-sm">
                      <input
                        aria-label='Password' name='password' type='test' className={'border-gray-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300  appearance-none rounded-md relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:z-10 sm:text-sm sm:leading-5'} placeholder='Remind me to...'

                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label htmlFor="last_name" className="block text-sm font-medium leading-5 text-gray-700">
            Task
                    </label>
                    <div className="mt-1 rounded-md shadow-sm">

                      <input
                        aria-label='Password' name='password' type='text' className={'border-gray-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300  appearance-none rounded-md relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:z-10 sm:text-sm sm:leading-5'} placeholder='Remind me to...'

                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label htmlFor="email" className="block text-sm font-medium leading-5 text-gray-700">
            Date
                    </label>
                    <div className="mt-1 rounded-md flex justify-center">
                      <DatepickerContainer>
                        <Datepicker
                          value={new Date(date + 8640000)}
                          onDateChange={value => {
                            setError('')
                            setDate(+new Date(value))
                          }}
                          minDate={new Date()}
                          initialVisibleDate={new Date(date + 8640000)}

                        />
                      </DatepickerContainer>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-200 pt-5">
              <div className="flex justify-end">
                <span className="inline-flex rounded-md shadow-sm">
                  <button type="button"
                    onClick={() => toggleModal(false)}
                    className="py-2 px-4 border border-gray-300 rounded-md text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition duration-150 ease-in-out">
          Cancel
                  </button>
                </span>
                <span className="ml-3 inline-flex rounded-md shadow-sm">
                  <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-indigo-700 transition duration-150 ease-in-out">
          Save
                  </button>
                </span>
              </div>
            </div>
          </form>

        </div>
      </Transition>

    </div>
  )
}
