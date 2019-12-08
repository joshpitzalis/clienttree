import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../utils/testSetup';
import { Onboarding, AddBox } from '../../onboarding/ActivityList';

describe.skip('network task features', () => {
  test('lets you complete and uncheck a task in contact box', () => false);
  test('lets you complete and uncheck a task in contact UTL', () => false);
  test('profile picture shows up in  UTL when you create a new user from network page', () =>
    false);

  test('add someone from the contact modal adds their picture to the task list', () =>
    false);

  test('update activities completed', () => false);

  test('update activities completed, when a task in unchecked', () => false);

  test('add percentage of people contacted to teh pie chart', () => false);

  test('will not let you delete user with active tasks', () => false);

  test('new task is not added when a contact is updated', () => false);
});
