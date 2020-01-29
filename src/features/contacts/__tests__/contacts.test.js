import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../utils/testSetup';
import Contacts from '../Contacts';

const mockProps = {
  handleImport: jest.fn(),
};

const rawContacts = [
  {
    first_name: 'Abbey',
    last_name: '',
    phone: [],
    email: [
      {
        address: 'abbey@abbeyskitchen.com',
        type: 'other',
        primary: true,
        selected: true,
      },
    ],
    address: [],
    groups: [],
    companies: [],
    photos: [],
    locations: [],
    __selectedMail__: 'abbey@abbeyskitchen.com',
    __selectedPhone__: '',
    __selectedAddress__: '',
    __letter__: 'a',
  },
  {
    first_name: 'Abbie',
    last_name: 'Hendrick',
    phone: [],
    email: [
      {
        address: 'info@abbieboudreau.com',
        type: 'other',
        primary: true,
        selected: true,
      },
    ],
    address: [],
    groups: [],
    companies: [],
    photos: [],
    locations: [],
    __selectedMail__: 'info@abbieboudreau.com',
    __selectedPhone__: '',
    __selectedAddress__: '',
    __letter__: 'a',
  },
  {
    first_name: 'Abbigayle',
    last_name: 'Smith',
    phone: [],
    email: [
      {
        address: 'info@abbigaylewarner.com',
        type: 'other',
        primary: true,
        selected: true,
      },
    ],
    address: [],
    groups: [],
    companies: [],
    photos: [],
    locations: [],
    __selectedMail__: 'info@abbigaylewarner.com',
    __selectedPhone__: '',
    __selectedAddress__: '',
    __letter__: 'a',
  },
];

describe('contacts', () => {
  it('fires cloudsponge function when clicked ', () => {
    const { getByTestId } = render(<Contacts {...mockProps} />, {
      initialState: {},
    });
    userEvent.click(getByTestId('importContacts'));
    expect(mockProps.handleImport).toHaveBeenCalled();
  });

  // 1.parse contacts for required fields only (name/email)
  // 2.get all existing contacts
  // 3.check for duplicate name/emails
  // 4.if comflict give option ot merge or create new
});
