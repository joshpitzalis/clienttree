import React from 'react';
import { createModel } from '@xstate/test';
import {
  cleanup,
  // fireEvent
} from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import { TaskBox, taskMachine } from '../components/TaskBox';
import { render } from '../../../utils/testSetup';

const statsModel = createModel(taskMachine).withEvents({
  TASK_OVERDUE: () => {},
  TASK_DUE_TODAY: () => {},
  CLOSED: () => {},
  // MODAL_OPENED: ({ getByTestId }) => {
  //   fireEvent.click(getByTestId('incomplete-screen'));
  // },
  // COMPLETE_MODAL_OPENED: ({ getByTestId }) => {
  //   fireEvent.click(getByTestId('statsTitle'));
  // },
  // CLOSED: {
  //   exec: async ({ getByTestId }, event) => {
  //     fireEvent.change(getByTestId('goal'), {
  //       target: { value: event.value },
  //     });
  //     fireEvent.click(getByTestId('close-button'));
  //   },
  //   cases: [{ value: 'something' }, { value: '' }],
  // },
});

const testPlans = statsModel.getSimplePathPlans();

testPlans.forEach(plan => {
  describe(plan.description, () => {
    // Do any cleanup work after testing each path
    afterEach(cleanup);

    plan.paths.forEach(path => {
      it(path.description, async () => {
        // Test setup
        const rendered = render(
          <TaskBox
            taskId="123"
            name="example"
            dateCompleted={2345}
            myUid="1111"
            completedFor="someone"
            setSelectedUser={() => {}}
            setVisibility={() => {}}
            photoURL="string"
            dispatch={() => {}}
            dueDate={157988670463899}
          />,
          {
            initialState: {},
          }
        );

        // Test execution
        await path.test(rendered);
      });
    });
  });
});

xit('coverage', () => statsModel.testCoverage());
