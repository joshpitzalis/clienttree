import React from 'react'
/* eslint-disable react/prop-types */
export function ErrorFallback ({ error, componentStack, resetErrorBoundary }) {
  return (<div className="bg-red-300 shadow sm:rounded-lg">
    <div className="px-4 py-5 sm:p-6">
      <div className="sm:flex sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Something went wrong 😱
          </h3>
          <div className="mt-2 max-w-xl text-sm leading-5 text-gray-500">
            <p>
              {error.message && error.message}
            </p>
          </div>
        </div>
        <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center">
          <span className="inline-flex rounded-md shadow-sm">

            <button type="button" className="inline-flex items-center px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-50 focus:outline-none focus:border-green-300 focus:shadow-outline-green active:bg-green-200 transition ease-in-out duration-150" onClick={resetErrorBoundary}>
              Reset
            </button>
          </span>
        </div>
      </div>
    </div>
  </div>)
}
