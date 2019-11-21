import React from 'react';
import { createModel } from '@xstate/test';
import { cleanup, fireEvent } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import StatsBox, { statsMachine } from '../StatsBox';
import { render } from '../../../utils/testSetup';

const statsModel = createModel(statsMachine).withEvents({
  MODAL_OPENED: ({ getByTestId }) => {
    fireEvent.click(getByTestId('incomplete-screen'));
  },
  COMPLETE_MODAL_OPENED: ({ getByTestId }) => {
    fireEvent.click(getByTestId('statsTitle'));
  },
  CLOSED: {
    exec: ({ getByTestId }) => fireEvent.click(getByTestId('closeModal')),
    cases: [
      {
        payload: {
          incomeGoalsCompleted: true,
        },
      },
      {
        payload: {
          incomeGoalsCompleted: false,
        },
      },
    ],
  },
});

const testPlans = statsModel.getSimplePathPlans();

testPlans.forEach(plan => {
  describe(plan.description, () => {
    // Do any cleanup work after testing each path
    afterEach(cleanup);

    plan.paths.forEach(path => {
      it(path.description, async () => {
        // Test setup
        const rendered = render(<StatsBox userId="123" />);

        // Test execution
        await path.test(rendered);
      });
    });
  });
});

xit('coverage', () => {
  statsModel.testCoverage();
});
