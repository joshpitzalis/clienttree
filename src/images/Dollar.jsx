import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  className: PropTypes.string.isRequired
}

const defaultProps = {}

export default function Dollar ({ className }) {
  return (
    <>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <line x1='12' y1='1' x2='12' y2='23' />
        <path d='M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
      </svg>
    </>
  )
}

Dollar.propTypes = propTypes
Dollar.defaultProps = defaultProps
