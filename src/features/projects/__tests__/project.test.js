import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { TestScheduler } from 'rxjs/testing';
import { SingleStage } from '../Stages';
import { render } from '../../../utils/testSetup';
import { stageTitleUpdate } from '../projectEpics';
import { setTitle } from '../dashAPI';

jest.mock('../dashAPI');
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

it.only('epic works as expected', () => {
  const testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
    // mock a jest function
    // expect(setTitle).toHaveBeenCalled();
    // expect(setTitle).toHaveBeenCalledWith(5);
  });

  testScheduler.run(({ hot, cold, expectObservable }) => {
    const action$ = hot('a', {
      a: {
        type: 'projects/updateTitle',
        payload: {
          title: 'example input',
          stageId: 'stage1',
        },
      },
    });
    const state$ = {
      value: {
        user: {
          userId: 'abc123',
          dashboard: {
            stages: {
              stage1: {
                id: 'stage1',
                title: 'Potential Projects',
                subtitle: ``,
                people: [],
              },
            },
          },
        },
      },
    };

    const dependencies = {
      setTitle: () => cold('a'),
    };
    const output$ = stageTitleUpdate(action$, state$, dependencies);

    expectObservable(output$).toBe('1000ms a', {
      a: {
        type: 'projects/fetchFulfilled',
      },
    });
  });
});
test.skip('autofocus input when open', () => false);
test.skip('title input should have existing title pre-filled, not an empty input', () =>
  false);
test.skip('get rid of flash on dashboard when loading', () => false);
test.skip('test error state/throw error', () => false);
it('updating stage title autosaves', () => {
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
test.skip('shows saving as it is saving', () => false);
test.skip('when teh input prop updates, the edit box is closed', () => false);
test.skip('auto saves updates', () => false);
test.skip('doesnt accept null values', () => false);
test.skip('collapsing stage should make state uneditable whenopening again', () =>
  false);
test.skip('opening one state shoudl close all others, or maybe just close them all on a timer of disuse', () =>
  false);
test.skip('if I click outside a stage it should close editability', () =>
  false);
test.skip('remove awkward blue focus outline from stages', () => false);
describe('stage CRUD', () => {
  test.skip('add a step', () => false);
  test.skip('add a step adds teh step to teh end', () => false);

  test.skip('remove a step', () => false);

  test.skip('you cannot destroy a step if there are people on it', () => false);
  test.skip('removin a step preserves the step order', () => false);
  test.skip('autofocus input when open', () => false);
});
