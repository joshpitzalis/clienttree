import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { TestScheduler } from 'rxjs/testing';
import { cleanup, wait, fireEvent, act } from '@testing-library/react';
import { render } from '../../../utils/testSetup';
import { Person } from '../components/Person';
import { Network } from '../Network';
import { updateContactEpic } from '../networkEpics';
import { setContact, setProfileImage, handleTracking } from '../peopleAPI';
import { PersonModal } from '../components/PersonBox';
import { Dashboard } from '../../../pages/Dashboard';

jest.mock('../peopleAPI', () => ({
  setContact: jest.fn(),
  setProfileImage: jest.fn().mockResolvedValueOnce('photoURL'),
  handleTracking: jest.fn(),
}));

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

const mockData = {
  setSelectedUser: jest.fn(),
  setVisibility: jest.fn(),
  contact: {
    uid: '123',
    lastContacted: 0,
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

describe('create people', () => {
  it('epic does not fire on open, it waits for a user interaction', async () => {
    const mockContact = {
      uid: '123',
      name: null,
      lastContacted: 0,
      activeTaskCount: 3,
      photoURL: 'string',
    };

    const { getByTestId } = render(<Person contact={mockContact} />, {
      initialState: {
        user: {
          userId: '123',
        },
      },
    });

    userEvent.click(getByTestId('openBox'));
    // userEvent.type(getByPlaceholderText('Their name...'), '');
    await wait(() => {
      expect(setContact).not.toHaveBeenCalled();
    });
  });
  it('epic does not fire if no uid', async () => {
    const mockContact = {
      uid: '',
      name: '',
      lastContacted: 0,
      activeTaskCount: 3,
      photoURL: 'string',
    };

    const { getByTestId, getByPlaceholderText } = render(
      <Person contact={mockContact} />,
      {
        initialState: {
          user: {
            userId: '123',
          },
        },
      }
    );

    userEvent.click(getByTestId('openBox'));
    userEvent.type(getByPlaceholderText('Their name...'), 'lala');
    await wait(() => {
      expect(setContact).not.toHaveBeenCalled();
    });
  });
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
            uid: 'xxx',
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
      <Person contact={mockData.contact} uid="" />,
      { initialState: { user: { userId: '123' } } }
    );

    userEvent.click(getByTestId('openBox'));
    userEvent.type(getByPlaceholderText('Their name...'), 'Mr. Happy');

    await wait(() =>
      expect(setContact).toHaveBeenCalledWith(
        '123',
        expect.objectContaining({
          name: 'Mr. Happy',
        })
      )
    );
  });
  it('saves avatar image when name is blurred', async () => {
    const { getByTestId, getByPlaceholderText } = render(
      <Person contact={mockData.contact} uid="" />,
      { initialState: { user: { userId: '123' } } }
    );

    userEvent.click(getByTestId('openBox'));
    userEvent.type(getByPlaceholderText('Their name...'), 'x');

    await wait(() =>
      expect(setContact).toHaveBeenCalledWith(
        '123',
        expect.not.objectContaining({
          photoURL: null,
        })
      )
    );
  });
  it('no blank names', async () => {
    // @ts-ignore
    setContact.mockReset();
    const { getByTestId, getByPlaceholderText } = render(
      <Person contact={mockData.contact} />,
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

    await wait(() => {
      expect(setContact).toHaveBeenCalled();
      expect(setContact).toHaveBeenCalledWith(
        '123',
        expect.objectContaining({
          name: 'Name cannot be blank',
        })
      );
    });
  });
  it('generated image by default', () => {
    const { container, getByTestId } = render(
      <Person contact={mockData.contact} />
    );
    userEvent.click(getByTestId('openBox'));
    const canvas = container.querySelector('canvas');
    expect(getByTestId('contactModal')).toContainElement(canvas);
  });
  it('errors if photo file is not jpg or png', () => {
    const { getByTestId } = render(<Person contact={mockData.contact} />);

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
    const { getByTestId } = render(<Person contact={mockData.contact} />);

    function MockFile(name = 'mock.png', size = 1024, mimeType = 'image/png') {
      function range(count) {
        let output = '';
        for (let i = 0; i < count; i += 1) {
          output += 'a';
        }
        return output;
      }

      /** @type {{lastModifiedDate: Date, name:string}} */
      // @ts-ignore
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
    const { getByTestId } = render(<Person contact={mockData.contact} />);

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
      <Person contact={mockData.contact} uid="userId123" />,
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
      null,
      null
    );
  });
  it('shows saving... and saved', async () => {
    const { getByTestId, getByPlaceholderText } = render(
      <Person contact={mockData.contact} />,
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
    expect(getByTestId('saveIndicator')).toHaveTextContent(/saving/i);
    // await wait(() => {
    //   getByTestId('saveIndicator');
    //   expect(getByTestId('saveIndicator')).toHaveTextContent(/saving/i);
    // });
  });
  it('does not say saved for the first test', () => {
    const { queryByTestId } = render(<Person contact={mockData.contact} />, {
      initialState: {
        user: {
          userId: '123',
        },
      },
    });
    userEvent.click(queryByTestId('openBox'));
    expect(queryByTestId('saveIndicator')).not.toBeInTheDocument();
  });
  it('adds a loading for contacts in network page', () => {
    const { getByTestId } = render(<Network uid="123" />);

    expect(getByTestId('loader')).toBeInTheDocument();
  });
  it('adds an empty state for contacts in network page', () => {
    const { getByTestId } = render(<Network uid="123" />, {
      initialState: { contacts: [] },
    });

    expect(getByTestId('emptyContacts')).toBeInTheDocument();
  });
  it.skip('be ble to add tasks when adding someone new', () => false);
  describe('update someone on the system', () => {
    it('opens an editable person box when you click on a person ', () => {
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
    test.skip('latest update first', () => {});
    test.skip('lets me remove people from dashboard', () => {});
    test.skip('is filled when opened', () => {});
    test.skip('update name', () => {});
    test.skip('uplaod photo', () => {});
    test.skip('update text update', () => {});

    test.skip('should show saving when you start editing a textarea', () => {});
    test.skip('update text date', () => {});
    test.skip('update task', () => {});
    test.skip('update task date', () => {});
  });

  describe('delete details from the system', () => {
    test('delete user', () => {
      const mockDelete = jest.fn();

      const { getByText } = render(
        <PersonModal
          contactId="123"
          handleDelete={mockDelete}
          uid="1234"
          onClose={jest.fn()}
          handleTracking={jest.fn()}
        />,
        {
          initialState: {
            contacts: [mockData.contact],
          },
        }
      );

      userEvent.click(getByText(/delete null/i));
      getByText(/confirm delete null/i);
      // expect(mockDelete).toBeCalledWith(55);
      // (_name, _uid, _userId)
    });
    test('cannot delete user if pending tasks', () => {
      const mockDelete = jest.fn();

      const { getByText } = render(
        <PersonModal
          contactId="123"
          handleDelete={mockDelete}
          uid="1234"
          onClose={jest.fn()}
          handleTracking={jest.fn()}
        />,
        {
          initialState: {
            contacts: [mockData.contact],
            tasks: [
              {
                completedFor: mockData.contact.uid,
                dateCompleted: null,
              },
            ],
          },
        }
      );

      userEvent.click(getByText(/delete null/i));
      getByText(/You must complete or remove all active tasks before/i);
      // expect(mockDelete).toBeCalledWith(55);
      // (_name, _uid, _userId)
    });
    test.skip('delete text update', () => {});
    test.skip('delete task', () => {});
  });

  test.skip('upload image, then update name should preserve both changes', () =>
    false);
  it.skip('if you edit note, name turns into cannot be blank automatically, make sure it adds photo image by default', () =>
    false);
});

describe('create notes', () => {
  it('edit notes on an existing contact', async () => {
    const exampleInput = 'lalala';
    const { getByTestId, getByPlaceholderText } = render(
      <Person contact={mockData.contact} />
    );
    userEvent.click(getByTestId('openBox'));
    await userEvent.type(getByPlaceholderText(/click to edit/i), exampleInput);
    expect(getByTestId('notesTextarea')).toHaveTextContent(exampleInput);
  });
  test.skip('should not let you enter a note in a new contact untill you have added a name', () => {});

  test.skip('it should add teh new note to the beginning of the timeline not the end', () => {});

  test.skip('only one note open at a time', () => {});
  test.skip('sort notes chronologocally', () => {});
  test.skip('first notes always appears by default', () => {});
  test.skip('add note alwats visible when editing a note', () => {});
  test.skip('date text update', () => {});
  test.skip('if no date update then it defaults to today', () => {});
  test.skip('click outside calendar in notes should close calendar', () => {});
  test.skip('changing date should change the date', () => {});
});

describe('create tasks', () => {
  // REMINDER_CREATED
  test.skip('clear sidebar when you unmount the person box', () => {});
  it('clicking on a users reveals their specific tasks list in the sidebar', () => {
    // load mock Dashboard
    const { getByTestId, getByText } = render(<Dashboard userId="123" />, {
      initialState: {
        contacts: [
          {
            activeTaskCount: 1,
            lastContacted: null,
            name: 'testUser',
            photoURL: '',
            summary: '',
            uid: 'WvUe4wawAWMg6fk88Gzb',
          },
        ],
      },
    });

    userEvent.click(getByTestId('networkPage'));
    getByTestId('networkTab');
    // establish generic sidebar
    getByTestId('universalTaskList');

    // click on contact
    userEvent.click(getByText('testUser'));
    // establish specific sidebar
    getByTestId('specificTaskList');
    // fill out the task
    // check it got add to the user
  });

  test('add reminder to an existing contact', () => {
    // load mock Dashboard
    const { getByTestId, getByText } = render(<Dashboard userId="123" />, {
      initialState: {
        contacts: [
          {
            activeTaskCount: 1,
            lastContacted: null,
            name: 'testUser',
            photoURL:
              'https://firebasestorage.googleapis.com/v0/b/client-tree-dev.appspot.com/o/contacts%2FWvUe4wawAWMg6fk88Gzb.png?alt=media&token=10b9a175-73df-447e-851f-a04d4418a9cc',
            summary: '',
            uid: 'WvUe4wawAWMg6fk88Gzb',
          },
        ],
      },
    });

    userEvent.click(getByTestId('networkPage'));
    getByTestId('networkTab');
    // establish generic sidebar
    getByTestId('universalTaskList');

    // click on contact
    userEvent.click(getByText('testUser'));
    // establish specific sidebar
    getByTestId('specificTaskList');
    // fill out the task
    // check it got add to the user
  });
  test.skip('edit a reminder', () => {});
  test.skip('complete a reminder', () => {});
  test.skip('conform completion before you complete a reminder', () => {});
  test.skip('gve people the option  to delete a reminder if it is no longer relevant', () => {});
  test.skip('throw confetti every time you complete a task', () => {});
  test.skip('you must only be able to select one user at a time,two users cannot be open atthe same time.', () => {});
  test.skip('add task to a new contact', () => {});
  test.skip('date task', () => {});
  test.skip('if you have a name then pre fill the name field', () => {});
  test.skip('when you complete a task it forces you to create next task', () => {});
  test.skip('default reminder date is next week ', () => {});
  test.skip('there is an edit reminder to edit an existing reminder ', () => {});
  test.skip('if you dont add a new task it doesn;t complete the previous task, if its teh last task ', () => {});
  test.skip('editing an existing reminder lets you delete the reminder altogether ', () => {});
  describe('email reminders', () => {
    test.skip('reminder triggers an email', () => {});
    test.skip('email is cancelled if reminder is cancelled ', () => {});
    test.skip('email is cancelled if reminder is completed ', () => {});
    test.skip('email is cancelled if date is changed', () => {});
  });
});

describe('other', () => {
  describe('login page', () => {
    test.skip('white text input', () => {});
    test.skip('button back ground', () => {});
  });

  test.skip('mobile version', () => {});
  test.skip('mobile landscape', () => {});
  test.skip('tablet version', () => {});
  test.skip('tablet landscape', () => {});
  test.skip('widescreen', () => {});
  test.skip('add add people button to project dashboard', () => {});
  test.skip(' add people button on project dashboard disappears if people are there', () => {});
  test.skip(' if I add someone  from teh dashboar teh toggle is on by default', () => {});
  test.skip('limit the number of task nibs to 5 or so', () => {
    const { getByLabelText } = render(<Person contact={mockData.contact} />);
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

  test.skip('dont show dashboard unless there is someone on it.', () => {});
});
