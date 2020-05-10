import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import userEvent from '@testing-library/user-event'
import { render } from '../../../utils/testSetup'
import { TaskBox } from '../components/TaskBox'

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
  setComplete: jest.fn()
}

describe('taskBox', () => {
  test('lets you complete a task in task box', () => {
    const {
      dispatch,
      taskId,
      myUid,
      completedFor,
      setSelectedUser,
      setVisibility
    } = mockProps

    const { getByTestId } = render(<TaskBox {...mockProps} />, {
      initialState: {}
    })
    getByTestId('incomplete')
    userEvent.click(getByTestId(mockProps.name))
    getByTestId('confirmation')
    userEvent.click(getByTestId('confirmDelete'))
    expect(mockProps.setComplete).toHaveBeenCalledWith({
      dispatch,
      taskId,
      myUid,
      completedFor,
      setSelectedUser,
      setVisibility
    })
  })

  test('goes straight to completed if already complete', () => {
    const newProps = { ...mockProps, dateCompleted: 123 }
    const { getByTestId } = render(<TaskBox {...newProps} />)
    getByTestId('complete')
  })

  test('if dueDate < now then task is overdue', () => {
    const newProps = { ...mockProps, dueDate: 123 }
    const { getByTestId } = render(<TaskBox {...newProps} />)
    getByTestId('overDue')
  })

  test('if dueDate < now + oneDayInMilliseconds then task is due today', () => {
    const newProps = { ...mockProps, dueDate: +new Date() + 100 }
    const { getByTestId } = render(<TaskBox {...newProps} />)
    getByTestId('dueToday')
  })

  // test.skip('lets you edit a task in task box', () => false);
  // test.skip('lets you delete a task in task box', () => false);
})

// describe('create tasks', () => {
//   // REMINDER_CREATED

//   it.skip('clicking on a users reveals their specific tasks list in the sidebar', () => {
//     // load mock Dashboard
//     const { getByTestId, getByText } = render(<Dashboard userId="123" />, {
//       initialState: {
//         contacts: [
//           {
//             activeTaskCount: 1,
//             lastContacted: null,
//             name: 'testUser',
//             photoURL: '',
//             summary: '',
//             uid: 'WvUe4wawAWMg6fk88Gzb',
//           },
//         ],
//       },
//     });

//     // userEvent.click(getByTestId('networkPage'));
//     // getByTestId('networkTab');
//     // establish generic sidebar
//     getByTestId('universalTaskList');

//     // click on contact
//     userEvent.click(getByText('testUser'));
//     // establish specific sidebar
//     getByTestId('specificTaskList');
//     // fill out the task
//     // check it got add to the user
//   });

//   test.skip('add reminder to an existing contact', () => {
//     // load mock Dashboard
//     const { getByTestId, getByText } = render(<Dashboard userId="123" />, {
//       initialState: {
//         contacts: [
//           {
//             activeTaskCount: 1,
//             lastContacted: null,
//             name: 'testUser',
//             photoURL:
//               'https://firebasestorage.googleapis.com/v0/b/client-tree-dev.appspot.com/o/contacts%2FWvUe4wawAWMg6fk88Gzb.png?alt=media&token=10b9a175-73df-447e-851f-a04d4418a9cc',
//             summary: '',
//             uid: 'WvUe4wawAWMg6fk88Gzb',
//           },
//         ],
//       },
//     });

//     // userEvent.click(getByTestId('networkPage'));
//     // getByTestId('networkTab');
//     // establish generic sidebar
//     getByTestId('universalTaskList');

//     // click on contact
//     userEvent.click(getByText('testUser'));
//     // establish specific sidebar
//     getByTestId('specificTaskList');
//     // fill out the task
//     // check it got add to the user
//   });
//   test.skip('edit a reminder', () => {});
//   test.skip('complete a reminder', () => {});
//   test.skip('conform completion before you complete a reminder', () => {});
//   test.skip('show completed date on  a reminder', () => {});
//   test.skip('edit reminders', () => {});
//   test.skip('gve people the option  to delete a reminder if it is no longer relevant', () => {});
//   test.skip('throw confetti every time you complete a task', () => {});

//   test.skip('add task to a new contact', () => {});
//   test.skip('date task', () => {});
//   test.skip('if you have a name then pre fill the name field', () => {});
//   test.skip('when you complete a task it forces you to create next task', () => {});
//   test.skip('if you dont add a new task it doesn;t complete the previous task, if its teh last task ', () => {});
//   test.skip('default reminder date is next week ', () => {});
// });

// describe.skip('network page', () => {
//   test('when task is complete update last contacted', () => false);
//   // test('when note is added update last contacted', () => false);
//   test('universal tasks ordered by dues date', () => false);
//   test('specific tasks ordered by dues date', () => false);
//   test('people ordered by  least contacted', () => false);
//   test('after you have about 10 contacts make the rmeind button teh primary button and demphasize teh add peopel button', () =>
//     false);
//   test('organise contacts by people I ahve not contacted for teh longerst', () =>
//     false);
//   test('let me add a reminder from mobile and create new contact', () => false);
//   test('let me add a reminder from mobile on existing contact', () => false);
//   test('encourage people to add past clients first as that is low hanging fruit', () =>
//     false);
// });

// describe.skip('email reminders', () => {
//   test('shoudl show everything over due', () => false);
//   test('shoudl indicate how oevrdue they are somehow', () => false);

//   xtest('faces show up beside their tasks in UTL', () => {
//     // this is now a cypress test
//   });

//   xtest('prevent submissions with empty values', () => {});
//   xtest('prevent submissions with empty values on mobile', () => {});
// });
