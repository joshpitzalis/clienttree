import { Datepicker, DatepickerContainer } from '@duik/it'
import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

import formatDistanceToNow from 'date-fns/formatDistanceToNow'

function useOutsideCloser (ref, setVisible) {
  /**
   * Alert if clicked on outside of element
   */
  function handleClickOutside (event) {
    if (ref.current && !ref.current.contains(event.target)) {
      setVisible(false)
    }
  }

  useEffect(() => {
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })
}

/** @param {{
 * lastUpdated: Date,
 * setState: function,
 * note: {
 *  id: string,
 *  text: string,
 *  lastUpdated: number
 * }}} [Props] */
/* eslint-disable react/prop-types */
export const TimeUpdate = ({ lastUpdated, setState, note }) => {
  const [visible, setVisible] = React.useState(false)
  const [date, setDate] = React.useState(new Date(lastUpdated))

  // closes date picker when you click outside the component
  const wrapperRef = useRef(null)
  useOutsideCloser(wrapperRef, setVisible)
  return (
    <div>
      {visible ? (
        <div
          ref={wrapperRef}
          className='mb3'
          style={{ width: '250px' }}
          data-testid='calendarBox'
        >
          <DatepickerContainer>
            <Datepicker
              value={date}
              onDateChange={value => {
                setDate(new Date(value))
                setState(prevState => ({
                  ...prevState,
                  notes: {
                    ...prevState.notes,
                    [note.id]: {
                      ...note,
                      lastUpdated: +new Date(value)
                    }
                  },
                  saving: true
                }))
                setVisible(false)
              }}
              maxDate={new Date()}
            />
          </DatepickerContainer>
        </div>
      ) : (
        <button
          type='button'
          data-testid='timeBox'
          onClick={() => setVisible(true)}
          className='bn text3 underline-hover pointer'
        >
          {lastUpdated &&
            formatDistanceToNow(new Date(lastUpdated), {
              addSuffix: true
            })}
        </button>
      )}
    </div>
  )
}

TimeUpdate.propTypes = {
  lastUpdated: PropTypes.number.isRequired
}

TimeUpdate.defaultProps = {}
