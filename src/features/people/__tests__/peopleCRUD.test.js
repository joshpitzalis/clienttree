import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { TestScheduler } from 'rxjs/testing';
import { render } from '../../../utils/testSetup';
import { Person } from '../components/Person';
import { Network } from '../Network';
import { updateContactEpic } from '../networkEpics';

describe('people CRUD', () => {
  const mockData = {
    setSelectedUser: jest.fn(),
    setVisibility: jest.fn(),
    contact: {
      uid: '123',
      lastContacted: false,
      activeTaskCount: 3,
      name: 'name name',
      photoURL: 'string',
    },
    selectedUser: {
      uid: '456',
      lastContacted: false,
      activeTaskCount: 3,
      name: 'other name',
      photoURL: 'string',
    },
  };
  it('click on a person open to an editable person box', () => {
    const { getByTestId } = render(
      <Person
        setSelectedUser={mockData.setSelectedUser}
        setVisibility={mockData.setVisibility}
        contact={mockData.contact}
        selectedUser={mockData.selectedUser}
      />
    );
    // expect closed
    expect(getByTestId('closedPeopleBox'));
    // userEvent click
    userEvent.click(getByTestId('openBox'));
    // expect open
    expect(getByTestId('openedPeopleBox'));
    // click again
    userEvent.click(getByTestId('closeBox'));
    // expect closed
    expect(getByTestId('closedPeopleBox'));
  });

  describe('add someone new to the system', () => {
    it('add button creates a new person box', () => {
      const { getByTestId, queryByTestId, getByPlaceholderText } = render(
        <Network uid="123" />
      );
      getByTestId('outreachPage');
      userEvent.click(getByTestId('addPeopleButton'));
      getByTestId('contactModal');
      expect(queryByTestId('addPeopleButton')).not.toBeInTheDocument();
      // assert name is blank
      expect(getByPlaceholderText('Their name...')).toBeEmpty();
      // assert text area is blank
      expect(getByPlaceholderText('Add an update')).toBeEmpty();
      userEvent.click(getByTestId('closeBox'));
      getByTestId('outreachPage');
    });

    it.skip('epic produces the correct actions', () => {
      const testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
        // mock a jest function
        // expect(setTitle).toHaveBeenCalled();
        // expect(setTitle).toHaveBeenCalledWith(5);
      });

      testScheduler.run(({ hot, cold, expectObservable }) => {
        const action$ = hot('a', {
          a: {
            type: 'people/updateForm',
            payload: {
              title: 'example name',
            },
          },
        });
        const state$ = {
          value: {},
        };
        const dependencies = {
          setFirebaseContactUpdate: () => cold('b'),
        };
        const output$ = updateContactEpic(action$, state$, dependencies);

        expectObservable(output$).toBe('1000ms c', {
          c: {
            type: 'people/formSaved',
          },
        });
      });
    });

    it('epic produces the correct error', () => {
      const testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
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
          updateUserProfile: () =>
            cold('#', null, {
              response: {
                message: 'Ooops',
              },
            }),
        };
        const output$ = stageTitleUpdate(action$, state$, dependencies);

        expectObservable(output$).toBe('1000ms a', {
          a: {
            type: 'projects/titleError',
            payload: 'Ooops',
            error: true,
            meta: {
              source: 'stageTitleUpdate',
            },
          },
        });
      });
    });
    test('add name', () => {
      const { getByTestId, getByPlaceholderText } = render(
        <Person
          setSelectedUser={mockData.setSelectedUser}
          setVisibility={mockData.setVisibility}
          contact={mockData.contact}
          selectedUser={mockData.selectedUser}
        />
      );

      userEvent.type(getByPlaceholderText('Their name...'), 'Mr. Happy');
      // assert data is fired
    });
    test.skip('no blank names', () => {});
    test.skip('generated image by default', () => {});
    test.skip('add photo', () => {});
    test.skip('add text update', () => {});
    test.skip('if no date update then it defaults to today', () => {});
    test.skip('date text update', () => {});
    test.skip('add task', () => {});
    test.skip('date task', () => {});
    test.skip('show saving... and saved', () => {});
    test.skip('lets me add people to dashboard', () => {});
  });

  describe('update someone on the system', () => {
    test.skip('is filled when opened', () => {});
    test.skip('update name', () => {});
    test.skip('uplaod photo', () => {});
    test.skip('update text update', () => {});
    test.skip('update text date', () => {});
    test.skip('update task', () => {});
    test.skip('update task date', () => {});
  });

  describe('delete details from the system', () => {
    test.skip('delete text update', () => {});
    test.skip('delete task', () => {});
    test.skip('delete user', () => {});
    test.skip('cannot delete if pending tasks', () => {});
  });
  test.skip('add add people button to project dashboard', () => {});
  test.skip('limit the number of task nibs to 5 or so', () => {
    const { getByLabelText } = render(
      <Person
        setSelectedUser={mockData.setSelectedUser}
        setVisibility={mockData.setVisibility}
        contact={mockData.contact}
      />
    );
    expect(getByLabelText(/Sign up to Client Tree/i)).toBeEnabled();
  });
});
