import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../utils/testSetup';
import { TaskBox } from '../components/TaskBox';

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
  setComplete: jest.fn(),
};

describe('network task features', () => {
  test('lets you complete a task in task box', () => {
    const {
      dispatch,
      taskId,
      myUid,
      completedFor,
      setSelectedUser,
      setVisibility,
    } = mockProps;

    const { getByTestId } = render(<TaskBox {...mockProps} />, {
      initialState: {},
    });
    getByTestId('incomplete');
    userEvent.click(getByTestId(mockProps.name));
    getByTestId('confirmation');
    userEvent.click(getByTestId('confirmDelete'));
    expect(mockProps.setComplete).toHaveBeenCalledWith({
      dispatch,
      taskId,
      myUid,
      completedFor,
      setSelectedUser,
      setVisibility,
    });
  });

  test('goes straight to completed if already complete', () => {
    const newProps = { ...mockProps, dateCompleted: 123 };
    const { getByTestId } = render(<TaskBox {...newProps} />);
    getByTestId('complete');
  });

  test('if dueDate < now then task is overdue', () => {
    const newProps = { ...mockProps, dueDate: 123 };
    const { getByTestId } = render(<TaskBox {...newProps} />);
    getByTestId('overDue');
  });

  test('if dueDate < now + oneDayInMilliseconds then task is due today', () => {
    const newProps = { ...mockProps, dueDate: +new Date() + 100 };
    const { getByTestId } = render(<TaskBox {...newProps} />);
    getByTestId('dueToday');
  });

  test.skip('lets you edit a task in task box', () => false);
  test.skip('lets you delete a task in task box', () => false);
});

describe.skip('sidebar task attributes', () => {
  test.skip('profile picture shows up in task box', () => false);
  test.skip('will not let you delete user with active tasks', () => false);
  test.skip('new task is not added when a contact is updated', () => false);
  test('organise task by due date', () => false);
  test('word  overflow', () => false);
  test(' senetence overflow', () => false);
  test('checkbox over flow', () => false);
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
  test('when task is complete update last contacted', () => false);
  // test('when note is added update last contacted', () => false);
  test('universal tasks ordered by dues date', () => false);
  test('specific tasks ordered by dues date', () => false);
  test('people ordered by  least contacted', () => false);
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
