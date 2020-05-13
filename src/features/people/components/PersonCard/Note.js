import PropTypes from 'prop-types'
import React from 'react'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import fromUnixTime from 'date-fns/fromUnixTime'

/**
   * @param  { {
    * text: String,
    * lastUpdated: String,
    * id: String,
    * index: Number,
    * setEditBox: (value: String) => void
    * }}
    */
export function Note ({ text, lastUpdated, id, index, setEditBox }) {
  return (
    <li className={`${index > 0 && 'border-t border-gray-200'}  pl-3 pr-4 py-3 flex items-center justify-between text-sm leading-5`}>
      <svg onClick={() => setEditBox(id)}
        data-testid={`${text}-edit`}
        className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z">
        </path>
      </svg>
      <div className="w-0 flex-1 flex items-center">
        <span className="ml-2 flex-1 w-0 truncate">
          {text}
        </span>
      </div>
      <div className="ml-4 flex-shrink-0">
        <a href="#" className="font-medium text-green-600 hover:text-green-500 transition duration-150 ease-in-out">
          {lastUpdated && formatDistanceToNow(fromUnixTime(Number(lastUpdated) / 1000), { addSuffix: true })}
        </a>
      </div>
    </li>
  )
}
Note.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  lastUpdated: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  setEditBox: PropTypes.func.isRequired
}
