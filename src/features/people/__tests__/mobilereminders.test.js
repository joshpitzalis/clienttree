import '@testing-library/jest-dom/extend-expect';
import React from 'react';
// import userEvent from '@testing-library/user-event';
import { render } from '../../../utils/testSetup';
import { MobileReminder } from '../components/MobileReminder';

const mockProps = {
  myUid: '345',
};

describe('network task features', () => {
  it.skip('when you create a new task it creates a new contact', () => {
    const { getByTestId } = render(<MobileReminder {...mockProps} />, {
      initialState: {},
    });
    getByTestId('open');
  });
  test('adds task to existing contact', () => {});
  test('uses existing contact photo', () => {});
  test('not allow blank name', () => {});
  test('not allow blank task name', () => {});
  test('throws confetti on overdue task completion', () => {});
});
