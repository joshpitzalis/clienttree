import React, { useState } from 'react'

export function InteractionsRow () {
  const [editBox, setEditBox] = useState(false)
  return (
    <div className="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5">
      <dt className="text-sm leading-5 font-medium text-gray-500">
      Past Interactions
      </dt>
      <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
        <ul className="border border-gray-200 rounded-md">
          {editBox
            ? <EditBox />
            : <li className="pl-3 pr-4 py-3 flex items-baseline text-sm leading-5">
              <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-50 focus:outline-none focus:border-green-300 focus:shadow-outline-green active:bg-green-200 transition ease-in-out duration-150" onClick={() => setEditBox(true)}>
            Add a new interaction
              </button>
            </li>
          }
          <Interaction />
          <Interaction />
        </ul>
      </dd>
    </div>)
}

function EditBox () {
  return (<div className="mt-1 sm:mt-0 sm:col-span-2 p-3">
    <div className="max-w-lg flex rounded-md shadow-sm">
      <textarea id="about" rows="5" className="p-3 form-textarea block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"></textarea>
    </div>
    <div className='flex justify-between items-baseline'><p className="mt-2 text-sm text-gray-500">Sun 10 March</p>
      <div><button type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-gray-700   focus:outline-none transition ease-in-out duration-150" onClick={() => {}}>
              Cancel
      </button>
      <button type="button" className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-50 focus:outline-none focus:border-green-300 focus:shadow-outline-green active:bg-green-200 transition ease-in-out duration-150" onClick={() => {}}>
                Save
      </button></div></div>

  </div>)
}

function Interaction () {
  return (<li className="border-t border-gray-200 pl-3 pr-4 py-3 flex items-center justify-between text-sm leading-5">
    <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
    <div className="w-0 flex-1 flex items-center">

      <span className="ml-2 flex-1 w-0 truncate">
              Fugiat ipsum ipsum deserunt culpa aute sint...
      </span>
    </div>

    <div className="ml-4 flex-shrink-0">
      <a href="#" className="font-medium text-green-600 hover:text-green-500 transition duration-150 ease-in-out">
              16 Jan 2020
      </a>
    </div>
  </li>)
}
