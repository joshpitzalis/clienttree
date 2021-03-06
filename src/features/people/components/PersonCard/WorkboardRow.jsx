import PropTypes from 'prop-types'
import React from 'react'
import { Toggle } from '@duik/it'

export function WorkboardRow ({ tracked, dispatch }) {
  return (
    <div className="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5">
      <dt className="text-sm leading-5 font-medium text-gray-500">
      Added to workboard
      </dt>
      <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
        <Toggle checked={tracked} onChange={() => dispatch({ type: 'contact/workboardToggle' })} data-testid='dashSwitch' />
      </dd>
    </div>)
}

WorkboardRow.propTypes = {
  tracked: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired
}
