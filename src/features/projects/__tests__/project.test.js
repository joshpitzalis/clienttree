import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { SingleStage } from '../Stages';
import { render } from '../../../utils/testSetup';

const mockData = {
  stage: {
    title: 'exampleTitle',
    id: '123',
    people: [],
  },
  provided: {
    dragHandleProps: () => {},
  },
  innerRef: () => {},
  droppableProps: { 'data-react-beautiful-dnd-droppable': '0' },
  people: [],
  setSelectedUser: () => {},
  setVisibility: () => {},
  snapshot: {},
};

it('lets me edit it stage title when I double click on it', () => {
  const { getByText, queryByText, getByTestId, queryByTestId } = render(
    <SingleStage
      innerRef={mockData.innerRef}
      droppableProps={mockData.droppableProps}
      people={mockData.people}
      setSelectedUser={mockData.setSelectedUser}
      setVisibility={mockData.setVisibility}
      snapshot={mockData.snapshot}
      provided={mockData.provided}
      stage={mockData.stage}
    />
  );
  expect(queryByTestId('editableTitle')).not.toBeInTheDocument();
  getByText(/exampleTitle/i);
  // does not work if you only click once
  userEvent.click(getByText(/exampleTitle/i));
  expect(queryByTestId('editableTitle')).not.toBeInTheDocument();
  userEvent.dblClick(getByText(/exampleTitle/i));
  getByTestId('editableTitle');
  expect(queryByText(/exampleTitle/i)).not.toBeInTheDocument();
  userEvent.dblClick(getByTestId('editableTitle'));
  expect(queryByTestId('editableTitle')).not.toBeInTheDocument();
  getByText(/exampleTitle/i);
});

it.only('updating stage title autosaves', () => {
  const { getByText, getByTestId, queryByTestId } = render(
    <SingleStage
      innerRef={mockData.innerRef}
      droppableProps={mockData.droppableProps}
      people={mockData.people}
      setSelectedUser={mockData.setSelectedUser}
      setVisibility={mockData.setVisibility}
      snapshot={mockData.snapshot}
      provided={mockData.provided}
      stage={mockData.stage}
    />
  );
  expect(queryByTestId('editableTitle')).not.toBeInTheDocument();
  getByText(/exampleTitle/i);
  userEvent.dblClick(getByText(/exampleTitle/i));
  getByTestId('editableTitle');
  userEvent.type(getByTestId('editableTitle'), 'hello');
  // check function gets fired after a few seconds
});

test.skip('auto saves updates', () => false);

test.skip('doesnt accept null values', () => false);
test.skip('collapsing stage should make state uneditable whenopening again', () =>
  false);
test.skip('opening one state shoudl close all others, or maybe just close them all on a timer of disuse', () =>
  false);
