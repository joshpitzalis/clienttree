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

describe.skip('sidebar task attributes', () => {
  test('click checkbox to confirm complete', () => false);
  test('nevermind works', () => false);
  test('confirm complete works', () => false);
  test('click to edit', () => false);
  test('confetti on completion', () => false);
  test('click to edit', () => false);
  test('shows task details', () => false);
  test('shows deadline', () => false);
  test('shows green red organe based on how over due', () => false);
  test('tasks with no names cannot be created', () => false);
});

describe.skip('create reminder options', () => {
  test('remind me next week', () => false);
  test('remind me next month', () => false);
  test('remind me in 3 months', () => false);
  test('remind me next year', () => false);
});

describe.skip('network page', () => {
  test('after you have about 10 contacts make the rmeind button teh primary button and demphasize teh add peopel button', () =>
    false);
  test('organise contacts by people I ahve not contacted for teh longerst', () =>
    false);
  test('let me add a reminder from mobile and create new contact', () => false);
  test('let me add a reminder from mobile on existing contact', () => false);
  test('encourage people to add past clients first as that is low hanging fruit', () =>
    false);
});

describe.skip('email reminders', () => {
  test('shoudl show everything over due', () => false);
  test('shoudl indicate how oevrdue they are somehow', () => false);
});
