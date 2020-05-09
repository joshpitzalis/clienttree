import React from 'react'
import { Datepicker, DatepickerContainer } from '@duik/it'
import Transition from '../../../utils/transition.js'
/* eslint-disable react/prop-types */
export const NewReminderModal = ({ showModal, toggleModal }) => {
  const [date, setDate] = React.useState(+new Date() + 604800000)
  const [, setError] = React.useState('')

  return (
    <div className="fixed bottom-0 inset-x-0 px-4 pb-6 sm:inset-0 sm:p-0 sm:flex sm:items-center sm:justify-center z-999">
      <Transition show={showModal} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
        </div>
      </Transition>

      <Transition show={showModal} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">

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
                      <input aria-label='Password' name='password' type='test' className={'border-gray-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300  appearance-none rounded-md relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:z-10 sm:text-sm sm:leading-5'} placeholder='Remind me to...' />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label htmlFor="last_name" className="block text-sm font-medium leading-5 text-gray-700">
                    Task
                    </label>
                    <div className="mt-1 rounded-md shadow-sm">

                      <input aria-label='Password' name='password' type='text' className={'border-gray-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300  appearance-none rounded-md relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:z-10 sm:text-sm sm:leading-5'} placeholder='Remind me to...' />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label htmlFor="email" className="block text-sm font-medium leading-5 text-gray-700">
                    Date
                    </label>
                    <div className="mt-1 rounded-md flex justify-center">
                      <DatepickerContainer>
                        <Datepicker value={new Date(date + 8640000)} onDateChange={value => {
                          setError('')
                          setDate(+new Date(value))
                        }} minDate={new Date()} initialVisibleDate={new Date(date + 8640000)} />
                      </DatepickerContainer>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-200 pt-5">
              <div className="flex justify-end">
                <span className="inline-flex rounded-md shadow-sm">
                  <button type="button" onClick={() => toggleModal(false)} className="py-2 px-4 border border-gray-300 rounded-md text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition duration-150 ease-in-out">
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

    </div>)
}
