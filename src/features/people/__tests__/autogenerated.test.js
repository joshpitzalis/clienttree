import React from 'react'
import { createModel } from '@xstate/test'
import { cleanup, fireEvent } from '@testing-library/react'
// import userEvent from '@testing-library/user-event';
import { TaskBox, taskMachine } from '../components/TaskBox'
import { render } from '../../../utils/testSetup'

const mockProps = {
  taskId: '123',
  name: 'example',
  dateCompleted: null,
  myUid: '1111',
  completedFor: 'someone',
  setSelectedUser: jest.fn(),
  setVisibility: jest.fn(),
  photoURL: 'string',
  dispatch: jest.fn(),
  dueDate: 157988670463899
}
const taskModel = createModel(taskMachine).withEvents({
  TASK_OVERDUE: () => {},
  TASK_DUE_TODAY: () => {},
  ALREADY_COMPLETED: () => {},
  COMPLETED: ({ getByTestId }) => {
    fireEvent.click(getByTestId(mockProps.name))
  }

  // CLOSED: {
  //   exec: async ({ getByTestId }, event) => {
  //     fireEvent.change(getByTestId('goal'), {
  //       target: { value: event.value },
  //     });
  //     fireEvent.click(getByTestId('close-button'));
  //   },
  //   cases: [{ value: 'something' }, { value: '' }],
  // },
})

const testPlans = taskModel.getSimplePathPlans()

testPlans.forEach(plan => {
  describe(plan.description, () => {
    // Do any cleanup work after testing each path
    afterEach(cleanup)

    plan && plan.paths && plan.paths.forEach(path => {
      it(path.description, async () => {
        // Test setup
        const rendered = render(<TaskBox {...mockProps} />, {
          initialState: {}
        })

        // Test execution
        await path.test(rendered)
      })
    })
  })
})
