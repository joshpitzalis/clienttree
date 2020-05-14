import PropTypes from 'prop-types'
import React, { useState } from 'react'
import format from 'date-fns/format'
import fromUnixTime from 'date-fns/fromUnixTime'

import Transition from '../../../../utils/transition.js'
/**
   * @param  { {
    * text: String,
    * lastUpdated: String,
    * id: String,
    * index: Number,
    * setEditBox: (value: String) => void,
    * dispatch: (value: String) => void
    * }}
    */
export function Note ({ text, lastUpdated, id, index, setEditBox, dispatch }) {
  const [deletable, setDeletability] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <li className={`${index > 0 && 'border-t border-gray-200'}  pl-3 pr-4 py-3 flex items-center justify-between text-sm leading-5`}
      onMouseEnter={() => setDeletability(true)}
      onMouseLeave={() => setDeletability(false)} >

      {!confirmDelete && <svg onClick={() => setEditBox(id)}
        data-testid={`${text}-edit`}
        className="cursor-pointer flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z">
        </path>
      </svg>}
      <div className="w-0 flex-1 flex items-center">
        <span className="ml-2 flex-1 w-0 truncate">
          {confirmDelete ? 'Are you absolutely sure ?' : text}
        </span>
      </div>

      {!confirmDelete && <div className="ml-4 flex-shrink-0">
        <p className="font-medium text-gray-600 hover:text-green-500 transition duration-150 ease-in-out">
          {lastUpdated &&
         format(new Date(fromUnixTime(lastUpdated / 1000)), 'd MMM yyyy')}
        </p>
      </div>}
      {confirmDelete &&
        <>
          <button type="button" className="m-0 px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-gray-700 focus:outline-none transition ease-in-out duration-150"
            onClick={() => setConfirmDelete(false)}>
        Cancel
          </button>
          <button
            type="button"
            data-testid={'confirm-delete'}

            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-50 focus:outline-none focus:border-red-300 focus:shadow-outline-red active:bg-red-200 transition ease-in-out duration-150"
            onClick={() => {
              dispatch({ type: 'note/deleted', payload: id })
              setConfirmDelete(false)
            }}>
         Delete
          </button></>
      }
      <div> {!confirmDelete &&
        <Transition show={deletable} enter='transition ease-in duration-700 transform' enterFrom='opacity-0' enterTo='opacity-100' leave='transition ease-out duration-500 transform' leaveFrom='opacity-100' leaveTo='opacity-0'>

          <svg className="ml-3 mb-2 cursor-pointer flex-shrink-0 h-5 w-5 text-red-500"
            data-testid={`${text}-delete`}
            onClick={() => setConfirmDelete(true)}
            fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" fillRule="evenodd"></path>
          </svg>
        </Transition>
      }  </div>
    </li>
  )
}
Note.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  lastUpdated: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  setEditBox: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired
}
