import PropTypes from 'prop-types'
import React, { useState } from 'react'
import Transition from '../../../../utils/transition.js'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import fromUnixTime from 'date-fns/fromUnixTime'

/**
   * @param  {{
   * notes: [{text: String, time: Date, id: String}],
   * dispatch: (value:{type:String, payload: String}) => void}
   */

export function InteractionsRow ({ notes, dispatch }) {
  const [editBox, setEditBox] = useState(false)

  return (
    <div className="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5">
      <dt className="text-sm leading-5 font-medium text-gray-500">
      Past Interactions
      </dt>
      <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
        <>
          <Transition show={editBox} enter='transition ease-in duration-300 transform' enterFrom='opacity-0' enterTo='opacity-100' leave='transition ease-out duration-500 transform absolute' leaveFrom='opacity-100 scale-100 ' leaveTo='opacity-0 scale-0'>
            <EditBox setEditBox={setEditBox} dispatch={dispatch}/>
          </Transition>
          <Transition show={!editBox} enter='transition ease-in duration-200 transform' enterFrom='opacity-0 scale-95 ' enterTo='opacity-100 scale-100' leave='transition ease-out duration-75 transform' leaveFrom='opacity-100' leaveTo='opacity-0'>
            <li className="pr-4 pb-3 flex items-baseline text-sm leading-5">
              <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-50 focus:outline-none focus:border-green-300 focus:shadow-outline-green active:bg-green-200 transition ease-in-out duration-150" onClick={() => setEditBox(true)}>
               Add an interaction
              </button>
            </li>
          </Transition>
        </>
        { notes && !!notes.length &&
        <ul className="border border-gray-200 rounded-md">
          {notes && notes.map((note, index) => <Interaction {...note} key={note.id}
            index={index}/>)}
        </ul>}
      </dd>
    </div>)
}

InteractionsRow.propTypes = {
  notes: PropTypes.arrayOf(
    {
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      lastUpdated: PropTypes.string.isRequired

    }),
  dispatch: PropTypes.func.isRequired
}

/**
 * @param  {{
 * setEditBox: (editBox:boolean)=> boolean,
 * dispatch: (value:{type:String, payload: String}) => void,
 * note: {
  * text: String,
  * lastUpdated: String,
  * id: String,
 * }
 * }}
 */

function EditBox ({ setEditBox, dispatch, note }) {
  const [text, setText] = useState(note ? note.text : '')

  const [lastUpdated, setTime] = useState(+new Date())
  return (
    <div className="mt-1 sm:mt-0 sm:col-span-2 p-3">
      <div className="max-w-lg flex rounded-md shadow-sm">
        <textarea id="about" rows="5" className="rounded-md p-3 form-textarea block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" value={text} onChange={e => setText(e.target.value)} placeholder='Add notes here...'></textarea>
      </div>
      <div className='flex justify-between items-baseline'><p className="mt-2 text-sm text-gray-500 underline" onClick={() => setTime('123456')}>Sun 10 March</p>
        <div><button type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-gray-700   focus:outline-none transition ease-in-out duration-150" onClick={() => {
          setText('')
          setEditBox(false)
        }}>
              Cancel
        </button>
        <button type="button" className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-50 focus:outline-none focus:border-green-300 focus:shadow-outline-green active:bg-green-200 transition ease-in-out duration-150"

          onClick={() => {
            dispatch({
              type: 'NEW_NOTE_SUBMITTED',
              payload: { text, id: note ? note.id : +new Date(), lastUpdated }
            })
            setEditBox(false)
          }}>

                Save Note
        </button></div></div>
    </div>
  )
}

EditBox.propTypes = {
  setEditBox: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  note: PropTypes.shape({
    id: PropTypes.string.isRequired.isRequired,
    text: PropTypes.string.isRequired.isRequired,
    lastUpdated: PropTypes.string.isRequired.isRequired
  })
}

/**
   * @param  { {
   * text: String,
   * lastUpdated: String,
   * id: String,
   * index: Number
   * }}
   */

function Interaction ({ text, lastUpdated, id, index }) {
  return (
    <li className={ `${index > 0 && 'border-t border-gray-200'}  pl-3 pr-4 py-3 flex items-center justify-between text-sm leading-5`}>
      <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
      <div className="w-0 flex-1 flex items-center">

        <span className="ml-2 flex-1 w-0 truncate">
          {text}
        </span>
      </div>

      <div className="ml-4 flex-shrink-0">
        <a href="#" className="font-medium text-green-600 hover:text-green-500 transition duration-150 ease-in-out">
          {lastUpdated && formatDistanceToNow(
            fromUnixTime(Number(lastUpdated) / 1000),
            { addSuffix: true }
          )}
        </a>
      </div>
    </li>)
}

Interaction.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  lastUpdated: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired
}
