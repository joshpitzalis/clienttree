import React from 'react'

/* eslint-disable react/prop-types */
export const HeaderRow = ({ newCard }) => {
  return (<div className="px-4 py-5 border-b border-gray-200 sm:px-6">
    <h3 className="text-lg leading-6 font-medium text-gray-900">
      {newCard ? 'Create' : 'Edit'} Contact Information
    </h3>
    <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">

      {newCard ? "Click on the 'Save' button at the bottom when you are done." : 'Click on any field to edit it.'}
    </p>
  </div>)
}
