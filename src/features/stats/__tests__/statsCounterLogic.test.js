import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StatsBox from '../StatsBox';
import { render } from '../../../utils/testSetup';
import { Input } from '../Input';
import { IncomeBox } from '../InputForm';
import { Dashboard } from '../../../pages/Dashboard';

afterEach(cleanup);

describe('stats counter logic', () => {
  const fakeData = {
    userId: '123',
  };

  describe('incrementing numbers', () => {
    test('if dropped on project handover completed increment project stats', () => {
      const { getByTestId, queryByTestId } = render(
        <StatsBox userId={fakeData.userId} />
      );
      expect(getByTestId('incomplete-screen')).toBeInTheDocument();
      expect(queryByTestId('contactModal')).not.toBeInTheDocument();
      expect(queryByTestId('complete-screen')).not.toBeInTheDocument();
    });

    test('make sure people did not drop it on itself', () => {});
    test('one a person incremenst teh stats they shouldn;t be able to increment agan', () => {
      // for example at the moment they could drop at the bginning and then drop onto 7 and it would increment again
    });
    test('if added to crm increment lead stats', () => {});
    test('if task completed increment activity stats', () => {});
    test('whenever  a task is completed  it shoudl update stats  box', () => {});
  });
  describe('reverting numbers', () => {
    test('if reveresed from project handover completed revert project stats', () => {});
    test('if removed from crm leads box revert lead stats', () => {});
    test('if task uncompleted rever activity stats', () => {});
    test('whenever  a task is uncompleted  it shoudl update stats  box', () => {});
  });
});
