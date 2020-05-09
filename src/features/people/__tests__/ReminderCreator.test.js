import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import userEvent from '@testing-library/user-event'
import { render } from '../../../utils/testSetup'
import { TaskBox } from '../components/TaskBox'

const mockProps = {
  taskId: '123',
  name: 'name',
  dateCompleted: null,
  myUid: '345',
  completedFor: 'someone',
  photoURL: 'photo',
  dueDate: 123,
  setSelectedUser: jest.fn(),
  setVisibility: jest.fn(),
  dispatch: jest.fn(),
  setComplete: jest.fn()
}

describe('taskBox', () => {
  test('lets you create a task for a person', () => {
    const {
      dispatch,
      taskId,
      myUid,
      completedFor,
      setSelectedUser,
      setVisibility
    } = mockProps

    const { getByTestId } = render(<TaskBox {...mockProps} />, {
      initialState: {}
    })
    getByTestId('incomplete')
    userEvent.click(getByTestId(mockProps.name))
    getByTestId('confirmation')
    userEvent.click(getByTestId('confirmDelete'))
    expect(mockProps.setComplete).toHaveBeenCalledWith({
      dispatch,
      taskId,
      myUid,
      completedFor,
      setSelectedUser,
      setVisibility
    })
  })
  test('validations')
  test('lets you create a task for any person on mobile')
  test('validations on mobile')
})
