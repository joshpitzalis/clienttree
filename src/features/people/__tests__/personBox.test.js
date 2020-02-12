import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../utils/testSetup';
import { PersonModal } from '../components/PersonBox';

const mockProps = {
  uid: '345',
  contactId: '123',
  onClose: jest.fn(),
  handleTracking: jest.fn(),
  handleDelete: jest.fn(),
  newPerson: false,
};

const mockStore = {
  initialState: {
    contacts: [
      {
        uid: '123',
        email: 'test@email.com',
      },
    ],
  },
};

describe('people Box', () => {
  it('if email adds email details to user box', () => {
    const { getByTestId, getByText } = render(<PersonModal {...mockProps} />, {
      ...mockStore,
    });
    userEvent.click(getByTestId('emailBox'));
    getByText('test@email.com');
  });
  it('if no email then social link is blank', () => {
    const { getByTestId, getByPlaceholderText, getByText } = render(
      <PersonModal {...mockProps} />
    );

    userEvent.click(getByTestId('emailBox'));
    getByText(/Click here to add email.../i);
    userEvent.click(getByText(/Click here to add email.../i));
    getByPlaceholderText(/Add email.../i);
  });
  it.todo(
    'clicking on icon reveals detail and close button, but hides email icon'
  );
  it.todo('lets me add an email ');
  it.todo('lets me edit an email ');
  it.todo('lets me remove an email ');

  it.todo('close button hides detail, reveals mail icon');

  it.todo('if no email then icon is at half opacitys');
  it.todo('avatars fall back');
  it.todo('uploaded image over writes fall back avatar');

  it.todo('success import - undefined in banner');

  it.todo('names dont always appear /annie');
  it.todo('email is in upper case for some reason');
  it.todo(
    'shut down email box should sto it being editable, or if saving become false'
  );
});
