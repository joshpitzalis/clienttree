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
  userId: '123',
  existingContacts: [],
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
    const resolve = jest.fn();
    const add = jest.fn();
    const set = jest.fn();

    const userId = '123';

    handleContactSync({
      userId,
      existingContacts,
      newContacts,
      resolve,
      add,
      set,
    });

    expect(resolve).toHaveBeenCalled();
    expect(resolve).toHaveBeenCalledWith(
      [
        {
          name: 'abbey',
          email: 'abbey@example.com',
        },
      ],
      newContacts
    );
    expect(add).not.toHaveBeenCalled();
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
    const resolve = jest.fn();
    const add = jest.fn();
    const set = jest.fn();
    const userId = '123';
    const error = jest.fn();

    handleContactSync({
      userId,
      existingContacts,
      newContacts,
      resolve,
      add,
      set,
      error,
    });

    expect(add).toHaveBeenCalled();
    expect(add).toHaveBeenCalledWith({ userId, newContacts, set, error });
    expect(resolve).not.toHaveBeenCalled();
  });

  it('write to db for each contact you add', () => {
    const newContacts = [
      { name: 'xabbey', email: 'xabbey@example.com' },
      { name: 'Donna', email: 'donna@example.com' },
    ];
    const userId = '123';
    const set = jest.fn();
    const error = jest.fn();
    const success = jest.fn();
    handleAddition({ userId, newContacts, set, error, success });
    expect(set).toHaveBeenCalledTimes(2);
  });

  it('throws an error if there is a problem adding contacts', async () => {
    const newContacts = [
      { name: 'xabbey', email: 'xabbey@example.com' },
      { name: 'Donna', email: 'donna@example.com' },
    ];
    const userId = '123';
    const set = jest.fn().mockRejectedValueOnce(new Error('Async error'));
    const error = jest.fn();
    const success = jest.fn();
    await handleAddition({ userId, newContacts, set, error, success });

    expect(error).toHaveBeenCalled();
    expect(error).toHaveBeenCalledWith(
      new Error('Async error'),
      'contacts/handleAddition'
    );
  });

  it('some indication that import completed successfully', async () => {
    const newContacts = [
      { name: 'xabbey', email: 'xabbey@example.com' },
      { name: 'Donna', email: 'donna@example.com' },
    ];
    const userId = '123';
    const set = jest.fn();

    const error = jest.fn();
    const success = jest.fn();
    await handleAddition({
      userId,
      newContacts,
      set,
      error,
      success,
    });
    expect(success).toHaveBeenCalled();
  });

  it('some indication that contacts are importing', async () => {
    const newContacts = [
      { name: 'xabbey', email: 'xabbey@example.com' },
      { name: 'Donna', email: 'donna@example.com' },
    ];
    const userId = '123';
    const setNewContact = jest.fn();

    const error = jest.fn();
    const success = jest.fn();
    await handleAddition({
      userId,
      newContacts,
      setNewContact,
      error,
      success,
    });
    expect(success).toHaveBeenCalled();
    expect(true).toBe(false);
  });

  it('lets you merge details then add', () => false);

  it('throws an error if there is a problem merging contacts', () => false);
  it('lets you keep existing details then add', () => false);

  it('adds email details to user box', () => false);

  it('avatars fall back', () => false);

  it('uploaded image over  writes fall back avatar', () => false);
  it('avatar image hieracrhy is correct', () => false);
});
