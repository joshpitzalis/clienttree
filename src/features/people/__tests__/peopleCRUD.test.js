import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { TestScheduler } from 'rxjs/testing';
import { cleanup, wait } from '@testing-library/react';
import { render } from '../../../utils/testSetup';
import { Person } from '../components/Person';
import { Network } from '../Network';
import { updateContactEpic } from '../networkEpics';
import { setContact } from '../peopleAPI';

jest.mock('../peopleAPI', () => ({
  setContact: jest.fn(),
}));
// jest.mock('../networkEpics');

afterEach(() => {
  cleanup();
});
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
      // <Person
      //   setSelectedUser={mockData.setSelectedUser}
      //   setVisibility={mockData.setVisibility}
      //   contact={mockData.contact}
      //   selectedUser={mockData.selectedUser}
      // />
      <Network uid="123" />,
      { initialState: { contacts: [mockData.contact] } }
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

    it('epic produces the correct actions', () => {
      // setContact.mockResolvedValue(of(''));

      const testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
        // // mock a jest function
        // expect(setContact).toHaveBeenCalled();
        // expect(setContact).toHaveBeenCalledWith({
        //   title: 'example name',
        // });
      });

      testScheduler.run(({ hot, cold, expectObservable }) => {
        const action$ = hot('a', {
          a: {
            type: 'people/updateForm',
            payload: {
              name: 'example name',
            },
          },
        });
        const state$ = {
          value: { user: { userId: '123' } },
        };
        const dependencies = {
          setContact: () =>
            cold('-a', {
              a: '',
            }),
        };
        const output$ = updateContactEpic(action$, state$, dependencies);

        expectObservable(output$).toBe('1000ms -c', {
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
            type: 'people/updateForm',
            payload: {
              name: 'example name',
            },
          },
        });

        const state$ = {
          value: { user: { userId: '123' } },
        };

        const dependencies = {
          setContact: () => cold('#', null, 'Ooops'),
        };

        const output$ = updateContactEpic(action$, state$, dependencies);

        expectObservable(output$).toBe('1000ms a', {
          a: {
            error: true,
            type: 'people/formError',
            payload: 'Ooops',
            meta: { source: 'updateContactEpic' },
          },
        });
      });
    });
    it('add name', async () => {
      setContact.mockReset();
      const { getByTestId, getByPlaceholderText } = render(
        <Person
          setSelectedUser={mockData.setSelectedUser}
          setVisibility={mockData.setVisibility}
          contact={mockData.contact}
          selectedUser={mockData.selectedUser}
        />
      );

      userEvent.click(getByTestId('openBox'));
      userEvent.type(getByPlaceholderText('Their name...'), 'Mr. Happy');
      // assert the text shows up first
      expect(getByTestId('contactName').value).toEqual('Mr. Happy');
      await wait(() => {
        expect(setContact).toHaveBeenCalled();
        expect(setContact).toHaveBeenCalledWith(undefined, {
          name: 'Mr. Happy',
          saving: true,
        });
      });
    });
    it.skip('no blank names', () => {
      const { getByTestId, getByPlaceholderText } = render(
        <Person
          setSelectedUser={mockData.setSelectedUser}
          setVisibility={mockData.setVisibility}
          contact={mockData.contact}
          selectedUser={mockData.selectedUser}
        />
      );

      userEvent.click(getByTestId('openBox'));

      userEvent.type(getByPlaceholderText('Their name...'), '');
      // assert the text shows up first
      expect(getByTestId('contactName').value).toEqual('Mr. Happy');
    });
    test.skip('generated image by default', () => {});
    test.skip('add photo', () => {});
    test.skip('add text update', () => {});
    test.skip('if no date update then it defaults to today', () => {});
    test.skip('date text update', () => {});
    test.skip('add task', () => {});
    test.skip('date task', () => {});
    test.skip('show saving... and saved', () => {});
    test.skip('lets me add people to dashboard', () => {});
    test.skip('add a loading and null state for contacts in network page', () => {});
    it.skip('click on a add some open to an editable person box', () => {
      const { getByTestId } = render(
        // <Person
        //   setSelectedUser={mockData.setSelectedUser}
        //   setVisibility={mockData.setVisibility}
        //   contact={mockData.contact}
        //   selectedUser={mockData.selectedUser}
        // />
        <Network uid="123" />
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

  test.skip(' add people button on project dashboard disappears if people are there', () => {});

  test.skip(' if I add someone  from teh dashboar teh toggle is on by default', () => {});

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
