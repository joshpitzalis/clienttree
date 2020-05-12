import React, { useState } from 'react'

/* eslint-disable react/prop-types */
export function FooterButtons ({ setVisibility, newCard, onSubmit }) {
  const [saving, setSaving] = useState(false)

  return (
    <div className="border-t border-gray-200 p-5">
      <div className="flex justify-between items-center ">
        {newCard ? <span >
        </span> : <span >
          <p className='text-red'>Delete Contact</p>
        </span>}
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
