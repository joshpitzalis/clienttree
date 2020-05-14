import { Datepicker, DatepickerContainer } from '@duik/it'
import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import format from 'date-fns/format'

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
 * setTime: function,
 * }} [Props] */

/* eslint-disable react/prop-types */
export const TimeUpdate = ({ lastUpdated, setTime, visible, setVisible }) => {
  const [date, setDate] = React.useState(new Date(lastUpdated))

  // closes date picker when you click outside the component
  const wrapperRef = useRef(null)
  useOutsideCloser(wrapperRef, setVisible)
  return (
    <div >
      {visible ? (
        <div
          ref={wrapperRef}
          className='mb3'
          data-testid='calendarBox'
        >
          <DatepickerContainer>
            <Datepicker
              value={date}
              onDateChange={value => {
                setDate(new Date(value))
                setTime(+new Date(value))
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
          className='bn pointer text-sm text-gray-400 underline mb3'
        >
          {lastUpdated &&
            format(new Date(lastUpdated), 'd MMM yyyy')}
        </button>
      )}
    </div>
  )
}

TimeUpdate.propTypes = {
  lastUpdated: PropTypes.number.isRequired
}

TimeUpdate.defaultProps = {}
