import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../utils/testSetup';
import { Contact } from '../components/NewPeopleBox';

const mockProps = {
  contact: {
    uid: 56,
    photoURL: '',
    name: 'hello',
    handle: 'something',
    bucket: 'archived',
  },
  userId: '123',
  activateContact: jest.fn(),
};

describe('contact chunker', () => {
  it('lets you fetch user with pictures from google', () => {
    // click on button
    // ensure x fires
    // mock result
    // ensure firestore fires
    // ensure modal opens
  });

  describe('toggle contacts', () => {
    it.only('activate contact', () => {
      const { getByTestId } = render(
        <Contact
          contact={mockProps.contact}
          activateContact={mockProps.activateContact}
        />
      );
      userEvent.click(getByTestId('activateContact'));
      expect(mockProps.activateContact).toHaveBeenCalled();
    });
    it.todo('archive contact  ');
    it.todo('trash a contact ');
  });
  it.todo('deduplicates incoming contacts');
  it.todo('shows you 818 potential total contacts count in chunker modal');
  it.todo('if contact already exist shows up as selected');
  it.todo('shorlist 10 contacts');
  it.todo('send email');
  it.todo('connect email to app');
  it.todo('send email if import cancelled mid process');
});

describe('helpers', () => {
  it.skip('it convert raw contact data into required output', () => {
    // expect(contactCleaner(raw)).toEqual(cleanResult);
  });
  it.skip('contact sorter sort constct by last contacted', () => {});
  it.skip('save contacts saves contacts', () => {});
});

describe('bugs', () => {
  it.todo('show all three stats if ther are contacts present');

  it.todo(
    'when you forst import people they show up as green, not red for overdiue, despite saying last contacted a year ago'
  );
  it.todo('cannot delete natasha');
  it.todo('no names on tasks');
  describe('people nconsistently jump around when editing', () => {
    it.todo('add picture , jumps to top');
    it.todo('add note , no change');
    it.todo('complete task , jumps to bottom');
  });
  it.todo('add completed tasks to timeline');
  it.todo(
    'when you click on nevermind on an overdue task, it losed its overdue coloured outline'
  );
  it.todo('drag universal tasks around');
  it.todo('edit an existing task');
  it.todo('clikcing on a task takes you to that user');
  it.todo('force next task?');
});

describe('contact chunker phase 2', () => {
  it.todo('bucketing');
});
