import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  className: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired
}

export default function Check ({ className, color }) {
  return (
    <>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <polyline points='20 6 9 17 4 12' />
      </svg>
    </>
  )
}

Check.propTypes = propTypes
