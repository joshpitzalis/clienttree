import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { TimeUpdate } from './TimeUpdate'
import { useMorph } from 'react-morph'

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
export function EditBox ({ setEditBox, dispatch, note }) {
  const [text, setText] = useState(note ? note.text : '')
  const morph = useMorph()
  const [lastUpdated, setTime] = useState(note ? note.lastUpdated : +new Date())
  const [visible, setVisible] = React.useState(false)
  return (
    <div className="mt-1 sm:mt-0 sm:col-span-2 p-3">
      <div className="flex justify-end">
        {visible &&
            <textarea
              {...morph}
              id="about"
              rows="5"
              className="ma3 mt0 rounded-md p-3 form-textarea block w-full sm:text-sm sm:leading-5"
              value={text}
              placeholder='Add notes here...'/> }
        <TimeUpdate
          lastUpdated={lastUpdated}
          setTime={setTime}
          note={note}
          visible={visible}
          setVisible={setVisible}
        />
      </div>

      {!visible &&
          <div {...morph} className="max-w-lg flex justify-end rounded-md shadow-sm">
            <textarea autoFocus id="about" rows="5" className="rounded-md p-3 form-textarea block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" value={text} onChange={e => setText(e.target.value)} placeholder='Add notes here...'/>

          </div>}

      <div className='flex justify-end items-baseline'>

        <div className='my-5'>
          <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-gray-700   focus:outline-none transition ease-in-out duration-150" onClick={() => {
            setText('')
            setEditBox(false)
          }}>
        Cancel
          </button>
          <button
            type="button"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-50 focus:outline-none focus:border-green-300 focus:shadow-outline-green active:bg-green-200 transition ease-in-out duration-150"
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
