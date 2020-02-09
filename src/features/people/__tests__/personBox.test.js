import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../utils/testSetup';
import { PersonBox } from '../components/PersonBox';

const mockProps = {
  uid: '345',
  contactId: '123',
  onClose: jest.fn(),
  handleTracking: jest.fn(),
  handleDelete: jest.fn(),
  newPerson: false,
};

describe('people Box', () => {
  it.skip('if email adds email details to user box', () => {
    const { getByTestId } = render(<PersonBox {...mockProps} />);
  });
  it.todo('test over dies indicator works');
  it.todo('lets me add a social contact detail');
  it.todo('lets me remove a social contact detail');
  it.todo('avatars fall back');
  it.todo('uploaded image over  writes fall back avatar');
  it.todo('show email if email link exists');
  it.todo(
    'clicking on icon reveals detail and close button, but hides email icon'
  );
  it.todo('close button hides detail, reveals mail icon');

  it.todo('if no email then icon is at half opacitys');
  it.todo('add new social links');
  it.todo('remove a social link');
  it.todo('edit a social links');

  it.todo('success import - undefined in banner');
  it.todo('if no email then icon is at half opacitys');
  it.todo('names dont always appear /annie');
  it.todo('email is in caos for some reason');
  it.todo(
    'shut down email box should sto it being editable, or if saving become false'
  );
});
