import React, { useState } from 'react'
// import Transition from '../../../../utils/transition.js'
/* eslint-disable react/prop-types */
import firebase from '../../../../utils/firebase'

export function FooterButtons ({ setVisibility, newCard, onSubmit, contactId, userId }) {
  const [saving, setSaving] = useState(false)
  return (
    <div className="border-t border-gray-200 p-5">
      <div className="flex justify-between items-center ">
        {newCard
          ? <span ></span>
          : <DeleteContact contactId={contactId} userId={userId} />}
        <div className="">
          <span className="inline-flex rounded-md shadow-sm">
            <button type="button" className="inline-flex justify-center mt-1 py-2 px-4 border border-gray-300 rounded-md text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition duration-150 ease-in-out"
              onClick={
                setVisibility
              }>
            Cancel
            </button>
          </span>
          <span className="ml-3 inline-flex rounded-md shadow-sm">
            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-700 transition duration-150 ease-in-out"
              onClick={() => {
                setSaving(true)
              }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </span>
        </div>
      </div>
    </div>)
}

export function DeleteContact ({ contactId, userId }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div className='flex items-baseline'>
      <p className='text-red cursor-pointer mt-2' onClick={() => setConfirmDelete(true)}>
        {confirmDelete ? 'Are you absolutely sure ?' : 'Delete Contact'}
      </p>

      {confirmDelete &&
        <>
          <button
            type="button"
            className="m-0 ml-3 px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-gray-700 focus:outline-none transition ease-in-out duration-150"
            onClick={() => setConfirmDelete(false)}>
        Cancel
          </button>
          <button
            type="button"
            data-testid={'confirm-delete'}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-50 focus:outline-none focus:border-red-300 focus:shadow-outline-red active:bg-red-200 transition ease-in-out duration-150"
            onClick={() => {
              firebase
                .firestore()
                .collection('users')
                .doc(userId)
                .collection('contacts')
                .doc(contactId).delete()
              setConfirmDelete(false)
            }}>
         Confirm Delete
          </button></>
      }
      <div>

      </div>
    </div>
  )
}
