import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../utils/testSetup';
import ImportContacts from '../Contacts';
import {
  parseContacts,
  handleContactSync,
  findDuplicates,
  handleResolution,
  handleAddition,
} from '../contacts.helpers.js';

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
    __selectedMail__: 'abbey@example.com',
    __selectedPhone__: '',
    __selectedAddress__: '',
    __letter__: 'a',
  },
  {
    first_name: 'SAM',
    last_name: 'Hendrick',
    phone: [],
    email: [
      {
        address: 'info@example.com',
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
    __selectedMail__: 'info@example.com',
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
        address: 'info@example.com',
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
    __selectedMail__: 'info@example.com',
    __selectedPhone__: '',
    __selectedAddress__: '',
    __letter__: 'a',
  },
];

describe('contacts', () => {
  it('fires cloudsponge function when clicked ', () => {
    const { getByTestId } = render(<ImportContacts {...mockProps} />, {
      initialState: {},
    });
    userEvent.click(getByTestId('importContacts'));
    expect(mockProps.handleImport).toHaveBeenCalled();
  });
  it('pareses contacts after recieving them', () => {
    const result = [
      { name: 'abbey', email: 'abbey@example.com' },
      { name: 'sam hendrick', email: 'info@example.com' },
      { name: 'abbigayle smith', email: 'info@example.com' },
    ];
    // ensures lower case and white space trimming
    expect(parseContacts(rawContacts)).toEqual(result);
  });

  it('checks for duplicates', () => {
    const existingContacts = [
      { name: 'abbey', email: 'abbey@example.com' },
      { name: 'sam hendrick', email: 'info@example.com' },
      { name: 'abbigayle smith', email: 'info@example.com' },
    ];

    const newContacts = [
      { name: 'abbey', email: 'abbey@example.com' },
      { name: 'Donna', email: 'donna@example.com' },
    ];

    const dulicates = [{ name: 'abbey', email: 'abbey@example.com' }];
    // name match or email match
    expect(findDuplicates(existingContacts, newContacts)).toEqual(dulicates);
  });

  it('if duplicates it resolves conflicts', () => {
    const existingContacts = [
      { name: 'abbey', email: 'abbey@example.com' },
      { name: 'sam hendrick', email: 'info@example.com' },
      { name: 'abbigayle smith', email: 'info@example.com' },
    ];

    const newContacts = [
      { name: 'abbey', email: 'abbey@example.com' },
      { name: 'Donna', email: 'donna@example.com' },
    ];
    const handleResolution = jest.fn();
    const handleAddition = jest.fn();

    const userId = '123';

    handleContactSync({
      userId,
      existingContacts,
      newContacts,
      handleResolution,
      handleAddition,
    });

    expect(handleResolution).toHaveBeenCalled();
    expect(handleResolution).toHaveBeenCalledWith(
      [
        {
          name: 'abbey',
          email: 'abbey@example.com',
        },
      ],
      newContacts
    );
    expect(handleAddition).not.toHaveBeenCalled();
  });

  it('if no duplicates it adds the new contacts', () => {
    const existingContacts = [
      { name: 'abbey', email: 'abbey@example.com' },
      { name: 'sam hendrick', email: 'info@example.com' },
      { name: 'abbigayle smith', email: 'info@example.com' },
    ];

    const newContacts = [
      { name: 'xabbey', email: 'xabbey@example.com' },
      { name: 'Donna', email: 'donna@example.com' },
    ];
    const handleResolution = jest.fn();
    const handleAddition = jest.fn();
    const setNewContact = jest.fn();
    const userId = '123';

    handleContactSync({
      userId,
      existingContacts,
      newContacts,
      handleResolution,
      handleAddition,
      setNewContact,
    });

    expect(handleAddition).toHaveBeenCalled();
    expect(handleAddition).toHaveBeenCalledWith(
      userId,
      newContacts,
      setNewContact
    );
    expect(handleResolution).not.toHaveBeenCalled();
  });

  it('write to db for each contact you add', () => {
    const newContacts = [
      { name: 'xabbey', email: 'xabbey@example.com' },
      { name: 'Donna', email: 'donna@example.com' },
    ];
    const userId = '123';
    const setNewContact = jest.fn();
    handleAddition(userId, newContacts, setNewContact);
    expect(setNewContact).toHaveBeenCalledTimes(2);
  });

  it.skip('throws an error if there is a problem adding contacts', () => false);

  it.skip('lets you merge details then add', () => false);

  it.skip('lets you keep existing details then add', () => false);

  it.skip('adds email details to user box', () => false);

  it.skip('avatars fall back', () => false);

  it.skip('uploaded image over  writes fall back avatar', () => false);
  it.skip('avatar image hieracrhy is correct', () => false);
});
