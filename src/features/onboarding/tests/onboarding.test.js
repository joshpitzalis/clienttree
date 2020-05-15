import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import { GettingStarted } from '../GettingStarted'
import { completePercentage } from '../ActivityList'
import { render } from '../../../utils/testSetup'

test('shows first task completed when you start', () => {
  const { getByLabelText } = render(<GettingStarted />)
  expect(getByLabelText(/Sign up to Client Tree/i)).toBeEnabled()
})

test('completePercentage is accurate', () => {
  const props = { 1: 'a', 2: 'b' }
  const result = completePercentage(props)
  expect(result).toBe(43)

  const props2 = {
    4: 'a',
    2: 'b',
    42: 'a',
    22: 'b',
    43: 'a',
    23: 'b'
  }
  const result2 = completePercentage(props2)
  expect(result2).toBe(100)
})
