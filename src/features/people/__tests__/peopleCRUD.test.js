import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { TestScheduler } from 'rxjs/testing';
import { cleanup, wait, fireEvent } from '@testing-library/react';
import { render } from '../../../utils/testSetup';
import { Person } from '../components/Person';
import { Network } from '../Network';
import { updateContactEpic } from '../networkEpics';
import { setContact, setProfileImage, handleTracking } from '../peopleAPI';

jest.mock('../peopleAPI', () => ({
  setContact: jest.fn(),
  setProfileImage: jest.fn().mockResolvedValueOnce('photoURL'),
  handleTracking: jest.fn(),
}));

beforeEach(() => {
  cleanup();
  jest.restoreAllMocks();
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
      const { getByTestId, getByPlaceholderText } = render(
        <Person
          setSelectedUser={mockData.setSelectedUser}
          setVisibility={mockData.setVisibility}
          contact={mockData.contact}
          selectedUser={mockData.selectedUser}
        />,
        {
          initialState: {
            user: {
              userId: '123',
            },
          },
        }
      );

      userEvent.click(getByTestId('openBox'));
      userEvent.type(getByPlaceholderText('Their name...'), 'Mr. Happy');
      // assert the text shows up first
      expect(getByTestId('contactName').value).toEqual('Mr. Happy');
      await wait(() => {
        expect(setContact).toHaveBeenCalled();
        expect(setContact).toHaveBeenCalledWith('123', {
          name: 'Mr. Happy',
          saving: true,
        });
      });
    });
    it('no blank names', async () => {
      setContact.mockReset();
      const { getByTestId, getByPlaceholderText } = render(
        <Person
          setSelectedUser={mockData.setSelectedUser}
          setVisibility={mockData.setVisibility}
          contact={mockData.contact}
          selectedUser={mockData.selectedUser}
        />,
        {
          initialState: {
            user: {
              userId: '123',
            },
          },
        }
      );

      userEvent.click(getByTestId('openBox'));
      userEvent.type(getByPlaceholderText('Their name...'), 'hello');
      userEvent.type(getByTestId('contactName'), ' ');

      // assert the text shows up first
      expect(getByTestId('contactName').value).toEqual(' ');
      await wait(() => {
        expect(setContact).toHaveBeenCalled();
        expect(setContact).toHaveBeenCalledWith('123', {
          name: 'Name cannot be blank',
          saving: true,
        });
      });
    });
    it('generated image by default', () => {
      const { container, getByTestId } = render(
        <Person
          setSelectedUser={mockData.setSelectedUser}
          setVisibility={mockData.setVisibility}
          contact={mockData.contact}
          selectedUser={mockData.selectedUser}
        />
      );
      userEvent.click(getByTestId('openBox'));
      const canvas = container.querySelector('canvas');
      expect(getByTestId('contactModal')).toContainElement(canvas);
    });
    it('errors if photo file is not jpg or png', () => {
      const { getByTestId } = render(
        <Person
          setSelectedUser={mockData.setSelectedUser}
          setVisibility={mockData.setVisibility}
          contact={mockData.contact}
          selectedUser={mockData.selectedUser}
        />
      );

      const file = new File(['(⌐□_□)'], 'chucknorris.png', {
        type: 'image/xxx',
      });

      userEvent.click(getByTestId('openBox'));
      fireEvent.change(getByTestId('profileImageUploader'), {
        target: { files: [file] },
      });
      expect(setProfileImage).not.toHaveBeenCalled();
      expect(getByTestId('contactModal')).toHaveTextContent(
        'Images can only be jpeg, jpg, png or gif'
      );
    });
    it('errors if photo file is too large', () => {
      const { getByTestId } = render(
        <Person
          setSelectedUser={mockData.setSelectedUser}
          setVisibility={mockData.setVisibility}
          contact={mockData.contact}
          selectedUser={mockData.selectedUser}
        />
      );

      function MockFile(name, size, mimeType) {
        name = name || 'mock.png';
        size = size || 1024;
        mimeType = mimeType || 'image/png';

        function range(count) {
          let output = '';
          for (let i = 0; i < count; i++) {
            output += 'a';
          }
          return output;
        }

        const blob = new Blob([range(size)], { type: mimeType });
        blob.lastModifiedDate = new Date();
        blob.name = name;

        return blob;
      }
      const file = MockFile('mock.png', 5000001);
      userEvent.click(getByTestId('openBox'));
      fireEvent.change(getByTestId('profileImageUploader'), {
        target: { files: [file] },
      });
      expect(setProfileImage).not.toHaveBeenCalled();
      expect(getByTestId('contactModal')).toHaveTextContent(
        'Images can only be 5mb or less'
      );
    });
    it('lets you add a profile photo', async () => {
      const { getByTestId } = render(
        <Person
          setSelectedUser={mockData.setSelectedUser}
          setVisibility={mockData.setVisibility}
          contact={mockData.contact}
          selectedUser={mockData.selectedUser}
        />
      );

      const file = new File(['(⌐□_□)'], 'chucknorris.png', {
        type: 'image/png',
      });

      userEvent.click(getByTestId('openBox'));
      fireEvent.change(getByTestId('profileImageUploader'), {
        target: { files: [file] },
      });
      await wait(() => {
        expect(setProfileImage).toHaveBeenCalled();
      });
    });
    it('lets me add people to dashboard', () => {
      const { getByTestId } = render(
        <Person
          setSelectedUser={mockData.setSelectedUser}
          setVisibility={mockData.setVisibility}
          contact={mockData.contact}
          selectedUser={mockData.selectedUser}
        />,
        {
          initialState: {
            user: {
              userId: 'userId123',
            },
            contacts: [
              {
                uid: '123',
                lastContacted: false,
                activeTaskCount: 3,
                name: 'name',
                photoURL: 'photo',
              },
            ],
          },
        }
      );
      userEvent.click(getByTestId('openBox'));
      userEvent.click(getByTestId('dashSwitch'));
      expect(handleTracking).toHaveBeenCalled();
      expect(handleTracking).toHaveBeenCalledWith(
        true,
        'userId123',
        '123',
        'name',
        'photo'
      );
    });
    it('add a note', () => {
      const {
        getByTestId,
        getByPlaceholderText,
        // debug
      } = render(
        <Person
          setSelectedUser={mockData.setSelectedUser}
          setVisibility={mockData.setVisibility}
          selectedUser={mockData.selectedUser}
          contact={mockData.contact}
        />
      );
      userEvent.click(getByTestId('openBox'));
      userEvent.type(getByPlaceholderText(/click to edit/i), 'lalala');
      // debug();
      expect(true).toBeFalsy()
    });

    test.skip('only one field open at a time', () => {});
    test.skip('sort notes chronologocally', () => {});
    test.skip('first notes always appears by default', () => {});
    test.skip('add note alwats visible when editing a note', () => {});
    test.skip('date text update', () => {});
    test.skip('if no date update then it defaults to today', () => {});

    test.skip('add task', () => {});
    test.skip('date task', () => {});

    test.skip('show saving... and saved', () => {});
    test.skip('add a loading and null state for contacts in network page', () => {});

    test.skip('upload image, then update name should preserve both changes', () => {});
  });

  describe('update someone on the system', () => {
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
    test.skip('lets me remove people to dashboard', () => {});
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
  describe('other', () => {
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

    test.skip('private routes', () => {});
    test.skip('projects blank UI', () => {});
    test.skip('people blank UI', () => {});
    test.skip('cypress mobile tests', () => {});
    test.skip('mobile view', () => {});
    test.skip('ipad view', () => {});
    test.skip('mobile hoz view', () => {});
    test.skip('ipad hoz view', () => {});
    test.skip('loading components for people', () => {});
    test.skip('image uploads', () => {});
    test.skip('firebase rules', () => {});
    test.skip('cypress CI', () => {});
    test.skip('test coverage in CI', () => {});
  });
});
