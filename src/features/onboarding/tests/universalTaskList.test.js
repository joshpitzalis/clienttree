import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../utils/testSetup';
import { Onboarding, AddBox } from '../ActivityList';

test('be able to add a task from the universal task list', () => {
  const { getByTestId } = render(<Onboarding uid="123" />);
  expect(getByTestId('addBox')).toBeEnabled();
});

test('pop open and closed', () => {
  const { getByTestId } = render(<Onboarding uid="123" />);
  expect(getByTestId('detailBox')).not.toHaveAttribute('open');
  userEvent.click(getByTestId('toggleAddBox'));
  expect(getByTestId('detailBox')).toHaveAttribute('open');
});

test('add box lets you submit form data', () => {
  const fakehandler = jest.fn();

  const fakeData = {
    userId: undefined,
    contactId: '',
    uid: '',
    name: 'lalala',
    summary: '',
    lastContacted: '',
    photoURL: '',
    imgString: '',
    taskName: 'bobobo',
  };
  const { getByPlaceholderText, getByTestId } = render(
    <AddBox setUser={fakehandler} />
  );

  userEvent.type(getByPlaceholderText(/name.../i), fakeData.name);
  userEvent.type(getByPlaceholderText(/activity.../i), fakeData.taskName);
  userEvent.click(getByTestId('addBoxSubmitButton'));

  expect(fakehandler).toHaveBeenCalled();
  expect(fakehandler).toHaveBeenCalledWith(fakeData);
});

test('create new person and task from Addbox, and make sure it shows up in UTL', () => {
  // this is now a cypress test
});

test('faces show up beside their tasks in UTL', () => {
  // this is now a cypress test
});

xtest('addbox autocomplete if there is an existing person with the same name', () => {
  // ✅
});
xtest('when you select someone it changes the picture in teh add box', () => {});

xtest('prevent submissions with empty values', () => {});

xtest('when new person is created, by default tehir last contacted date is over a year ago, tehir profile is auto generated and their description is blank', () => {});

xtest('edit a task from the UTS', () => {});
