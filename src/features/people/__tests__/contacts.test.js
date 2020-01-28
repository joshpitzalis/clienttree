import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../utils/testSetup';

import { Modal } from '../components/ContactModal';

describe('contact box features', () => {
  test.skip('date format in contact box', () => {
    // test that the date picker works as a date picker
    // also test that if there is no previous date it defaults to today
    // test that the today button works
    const { getByLabelText } = render(<Modal />);
    expect(getByLabelText(/Sign up to Client Tree/i)).toBeEnabled();
  });

  test.skip('can only set date from today or earlier, on future dates', () => {
    const { getByLabelText } = render(<Modal />);
    expect(getByLabelText(/Sign up to Client Tree/i)).toBeEnabled();
  });

  test.skip('tracked on dash does not work', () => {
    const { getByLabelText } = render(<Modal />);
    expect(getByLabelText(/Sign up to Client Tree/i)).toBeEnabled();
  });

  test.skip('add task', () => {
    const { getByLabelText } = render(<Modal />);
    expect(getByLabelText(/Sign up to Client Tree/i)).toBeEnabled();
  });

  test.skip('open an existing user', () => {
    const { getByLabelText } = render(<Modal />);
    expect(getByLabelText(/Sign up to Client Tree/i)).toBeEnabled();
  });

  test.skip('you cant delete people if they are still on teh dashboard', () => {
    const { getByLabelText } = render(<Modal />);
    expect(getByLabelText(/Sign up to Client Tree/i)).toBeEnabled();
  });
});
