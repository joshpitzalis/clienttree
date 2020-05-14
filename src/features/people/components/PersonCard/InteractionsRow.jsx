import PropTypes from 'prop-types'
import React, { useState } from 'react'
import Transition from '../../../../utils/transition.js'
import { EditBox } from './EditBox'
import { Note } from './Note'

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
            <EditBox setEditBox={setEditBox} dispatch={dispatch}
              note={notes.find(({ id }) => id === editBox)}/>
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
        <ul className="border border-gray-200 rounded-md" id='notesBox'>
          {notes && notes.map((note, index) => <Note
            {...note}
            key={note.id}
            index={index}
            setEditBox={setEditBox}
            dispatch={dispatch}/>
          )}
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
