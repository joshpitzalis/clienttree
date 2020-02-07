import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../utils/testSetup';
import ImportContacts from '../Contacts';
import {
  MergeManager,
  findMatchingExistingContact,
} from '../components/ConflictScreen';
import {
  parseContacts,
  handleContactSync,
  findDuplicates,
  handleAddition,
} from '../contacts.helpers.js';

const mockProps = {
  handleImport: jest.fn(),
  userId: '123',
  existingContacts: [],

  set: jest.fn(),
  pending: jest.fn(),
  error: jest.fn(),
  success: jest.fn(),
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

  it('if duplicates it resolves conflicts', () => {
    const existingContacts = [
      { name: 'abbey', email: 'abbe@example.com' },
      { name: 'sam hendrick', email: 'info@example.com' },
      { name: 'abbigayle smith', email: 'info@example.com' },
    ];

    const newContacts = [
      { name: 'abbey', email: 'abbey@example.com' },
      { name: 'Donna', email: 'donna@example.com' },
    ];
    const setDuplicates = jest.fn();
    const add = jest.fn();
    const set = jest.fn();
    const error = jest.fn();
    const userId = '123';

    handleContactSync({
      userId,
      existingContacts,
      newContacts,
      setDuplicates,
      add,
      set,
      error,
    });

    expect(setDuplicates).toHaveBeenCalled();
    expect(setDuplicates).toHaveBeenCalledWith([
      {
        name: 'abbey',
        email: 'abbe@example.com',
      },
    ]);
    expect(add).toHaveBeenCalled();
    expect(add).toHaveBeenCalledWith({
      userId,
      newContacts: [{ name: 'Donna', email: 'donna@example.com' }],
      set,
      error,
    });
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
    const setDuplicates = jest.fn();
    const add = jest.fn();
    const set = jest.fn();
    const userId = '123';
    const error = jest.fn();

    handleContactSync({
      userId,
      existingContacts,
      newContacts,
      setDuplicates,
      add,
      set,
      error,
    });

    expect(add).toHaveBeenCalled();
    expect(add).toHaveBeenCalledWith({ userId, newContacts, set, error });
    expect(setDuplicates).not.toHaveBeenCalled();
  });

  it('write to db for each contact you add', () => {
    const newContacts = [
      { name: 'xabbey', email: 'xabbey@example.com' },
      { name: 'Donna', email: 'donna@example.com' },
    ];
    const { userId, set, pending, error, success } = mockProps;

    handleAddition({ userId, newContacts, set, error, success, pending });
    expect(set).toHaveBeenCalledTimes(2);
  });

  it('throws an error if there is a problem adding contacts', async () => {
    const newContacts = [
      { name: 'xabbey', email: 'xabbey@example.com' },
      { name: 'Donna', email: 'donna@example.com' },
    ];
    const { userId, pending, error, success } = mockProps;

    const set = jest.fn().mockRejectedValueOnce(new Error('Async error'));

    await handleAddition({ userId, newContacts, set, error, success, pending });

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
    const { userId, set, pending, error, success } = mockProps;

    await handleAddition({
      userId,
      newContacts,
      set,
      error,
      success,
      pending,
    });
    expect(success).toHaveBeenCalled();
  });

  it('some indication that contacts are importing', async () => {
    const newContacts = [
      { name: 'xabbey', email: 'xabbey@example.com' },
      { name: 'Donna', email: 'donna@example.com' },
    ];
    const { userId, set, pending, error, success } = mockProps;

    await handleAddition({
      userId,
      newContacts,
      set,
      error,
      success,
      pending,
    });
    expect(pending).toHaveBeenCalled();
  });

  it.todo('if no conflict and no name, replace name with email');
});

describe('conflicts', () => {
  describe.only('determine contact conflicts', () => {
    // should rename findDuplicates to findConflicts since identical duplicates are not a conflict

    // NAME_MATCHES      EMAIL_MATCHES    CONFLICT
    // true              true             false (identical)
    // true              false            true
    // false             true             true
    // false             false            false

    it('name Match and Email match results in no conflict', () => {
      const existingContacts = [{ name: 'abbey', email: 'abbey@example.com' }];

      const newContacts = [{ name: 'abbey', email: 'abbey@example.com' }];

      const duplicates = [];

      expect(findDuplicates(existingContacts, newContacts)).toEqual(duplicates);
    });

    it('if names Match and Emails do NOT match it results in a conflict', () => {
      const existingContacts = [
        { name: 'abbey', email: 'abbe@example.com' },
        { name: 'abbey3', email: 'abbe3@example.com' },
      ];

      const newContacts = [
        { name: 'abbey', email: 'different@example.com' },
        { name: 'abbey2', email: 'abbey2@example.com' },
      ];

      const duplicates = [{ name: 'abbey', email: 'abbe@example.com' }];

      expect(findDuplicates(existingContacts, newContacts)).toEqual(duplicates);
    });

    it('names do NOT Match and Email match results in conflict', () => {
      const existingContacts = [
        { name: 'abbey1', email: 'abbe@example.com' },
        { name: 'abbey3', email: 'abbe3@example.com' },
      ];

      const newContacts = [
        { name: 'abbey4', email: 'abbe@example.com' },
        { name: 'abbey2', email: 'abbey2@example.com' },
      ];

      const duplicates = [{ name: 'abbey1', email: 'abbe@example.com' }];

      expect(findDuplicates(existingContacts, newContacts)).toEqual(duplicates);
    });

    it('names do NOT Match and Emails do NOT match results in no conflict', () => {
      const existingContacts = [{ name: 'abbey1', email: 'abbe3@example.com' }];

      const newContacts = [{ name: 'abbey2', email: 'abbe4@example.com' }];

      const duplicates = [];

      expect(findDuplicates(existingContacts, newContacts)).toEqual(duplicates);
    });

    // blank fields edge cases

    it('if contacts have the same name but new contact has a blank email then it should NOT count as a conflict', () => {
      const existingContacts = [{ name: 'abbey', email: 'abbey@example.com' }];

      const newContacts = [{ name: 'abbey', email: '' }];

      const duplicates = [];

      expect(findDuplicates(existingContacts, newContacts)).toEqual(duplicates);
    });

    it('if contacts have the same name but existing contact has a blank email then it should count as a conflict ', () => {
      const existingContacts = [{ name: 'abbey', email: '' }];

      const newContacts = [{ name: 'abbey', email: 'abbey@example.com' }];

      const duplicates = [{ name: 'abbey', email: '' }];

      expect(findDuplicates(existingContacts, newContacts)).toEqual(duplicates);
    });

    it.todo('repeat for email');
  });

  it('findMatchingExistingContact finds the matching duplicate in the existing contact list - if names or emails match then match', () => {
    const existingContacts = [
      {
        activeTaskCount: 1,
        lastContacted: 34,
        name: 'abbey',
        notes: {
          '9007199254740991': {
            id: 9007199254740991,
            lastUpdated: 9007199254740991,
            text: '',
          },
        },
        photoURL: '',
        summary: '',
        uid: 'existingUid',
      },
      {
        activeTaskCount: 1,
        lastContacted: 1580719638589,
        name: 'mouyyad abdulhadi',
        notes: {
          '9007199254740991': {
            id: 9007199254740991,
            lastUpdated: 9007199254740991,
            text: '',
          },
        },
        photoURL:
          'data:image/png;base64,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',
        summary: '',
        uid: 'RU7O9X65JTZ42t0ciJpx',
      },
      {
        activeTaskCount: 1,
        lastContacted: 1580730075890,
        name: 'gv aditya',
        notes: {
          '9007199254740991': {
            id: 9007199254740991,
            lastUpdated: 9007199254740991,
            text: '',
          },
        },
        photoURL: '',
        summary: '',
        uid: 'IxbQiHcJSpdLRTGYNe7q',
      },
    ];
    const duplicate = {
      activeTaskCount: 1,
      lastContacted: 34,
      name: 'abbey',
      notes: {
        '9007199254740991': {
          id: 9007199254740991,
          lastUpdated: 9007199254740991,
          text: '',
        },
      },
      photoURL: '',
      summary: '',
      email: '43',
      uid: 'skC92c6rKrw1rWGTqCuM',
    };
    expect(findMatchingExistingContact(duplicate, existingContacts)).toEqual({
      activeTaskCount: 1,
      lastContacted: 34,
      name: 'abbey',
      notes: {
        '9007199254740991': {
          id: 9007199254740991,
          lastUpdated: 9007199254740991,
          text: '',
        },
      },
      photoURL: '',
      summary: '',
      uid: 'existingUid',
    });
  });

  it('findMatchingExistingContact - if both emails blank but then names match then match', () => {
    const existingContacts = [
      {
        activeTaskCount: 1,
        lastContacted: 34,
        name: 'abbey',
        notes: {
          '9007199254740991': {
            id: 9007199254740991,
            lastUpdated: 9007199254740991,
            text: '',
          },
        },
        photoURL: '',
        summary: '',
        email: '',
        uid: 'existingUid',
      },
      {
        activeTaskCount: 1,
        lastContacted: 1580719638589,
        name: 'mouyyad abdulhadi',
        notes: {
          '9007199254740991': {
            id: 9007199254740991,
            lastUpdated: 9007199254740991,
            text: '',
          },
        },
        photoURL:
          'data:image/png;base64,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',
        summary: '',
        uid: 'RU7O9X65JTZ42t0ciJpx',
      },
      {
        activeTaskCount: 1,
        lastContacted: 1580730075890,
        name: 'gv aditya',
        notes: {
          '9007199254740991': {
            id: 9007199254740991,
            lastUpdated: 9007199254740991,
            text: '',
          },
        },
        photoURL: '',
        summary: '',
        uid: 'IxbQiHcJSpdLRTGYNe7q',
      },
    ];
    const duplicate = {
      activeTaskCount: 1,
      lastContacted: 34,
      name: 'gv aditya',
      notes: {
        '9007199254740991': {
          id: 9007199254740991,
          lastUpdated: 9007199254740991,
          text: '',
        },
      },
      photoURL: '',
      summary: '',
      email: '',
      uid: 'skC92c6rKrw1rWGTqCuM',
    };
    expect(findMatchingExistingContact(duplicate, existingContacts)).toEqual(
      existingContacts[2]
    );
  });

  it('findMatchingExistingContact - if both names are blank but emails match then match', () => {
    const existingContacts = [
      {
        activeTaskCount: 1,
        lastContacted: 34,
        name: '',
        notes: {
          '9007199254740991': {
            id: 9007199254740991,
            lastUpdated: 9007199254740991,
            text: '',
          },
        },
        photoURL: '',
        summary: '',
        email: 'a@a.com',
        uid: 'existingUid',
      },
    ];
    const duplicate = {
      activeTaskCount: 1,
      lastContacted: 34,
      name: '',
      notes: {
        '9007199254740991': {
          id: 9007199254740991,
          lastUpdated: 9007199254740991,
          text: '',
        },
      },
      photoURL: '',
      summary: '',
      email: 'a@a.com',
      uid: 'skC92c6rKrw1rWGTqCuM',
    };
    expect(findMatchingExistingContact(duplicate, existingContacts)).toEqual(
      existingContacts[0]
    );
  });

  it.todo('if incoming data matches exactly then do not create a conflict');

  it.todo('do not overwrite uid when importing');
  it.todo('when you add people they should be long over due');
  it('closes conflict box when no more conflicts', () => {
    const existingContacts = [
      {
        activeTaskCount: 1,
        lastContacted: 34,
        name: 'abbey',
        notes: {
          '9007199254740991': {
            id: 9007199254740991,
            lastUpdated: 9007199254740991,
            text: '',
          },
        },
        photoURL: '',
        summary: '',
        uid: 'existingUid',
      },
    ];
    const duplicates = [
      {
        activeTaskCount: 1,
        lastContacted: 34,
        name: 'abbey',
        notes: {
          '9007199254740991': {
            id: 9007199254740991,
            lastUpdated: 9007199254740991,
            text: '',
          },
        },
        photoURL: '',
        summary: '',
        uid: 'skC92c6rKrw1rWGTqCuM',
      },
    ];

    const handleDuplicateSelection = jest.fn();
    const handleExistingSelection = jest.fn();
    const send = jest.fn();

    const { getByTestId, findByText } = render(
      <MergeManager
        send={send}
        duplicates={duplicates}
        existingContacts={existingContacts}
        handleDuplicateSelection={handleDuplicateSelection}
        handleExistingSelection={handleExistingSelection}
      />
    );
    findByText(/1 \/ 1 duplicates/i);
    userEvent.click(getByTestId(/newContact/i));
    expect(send).toHaveBeenCalledWith('CLOSED');
  });

  it('lets you keep existing details for conflicts', () => {
    const duplicates = [
      {
        activeTaskCount: 1,
        lastContacted: 34,
        name: 'abbey',
        notes: {
          '9007199254740991': {
            id: 9007199254740991,
            lastUpdated: 9007199254740991,
            text: '',
          },
        },
        photoURL: '',
        summary: '',
        uid: 'skC92c6rKrw1rWGTqCuM',
      },
      {
        activeTaskCount: 1,
        lastContacted: 1580730075890,
        name: 'gv aditya',
        notes: {
          '9007199254740991': {
            id: 9007199254740991,
            lastUpdated: 9007199254740991,
            text: '',
          },
        },
        photoURL: '',
        summary: '',
        uid: 'IxbQiHcJSpdLRTGYNe7q',
      },
    ];
    const existingContacts = [
      {
        activeTaskCount: 1,
        lastContacted: 34,
        name: 'abbey',
        notes: {
          '9007199254740991': {
            id: 9007199254740991,
            lastUpdated: 9007199254740991,
            text: '',
          },
        },
        photoURL: 'xxx',
        summary: '',
        uid: 'existingUid',
      },
      {
        activeTaskCount: 1,
        lastContacted: 1580719638589,
        name: 'mouyyad abdulhadi',
        notes: {
          '9007199254740991': {
            id: 9007199254740991,
            lastUpdated: 9007199254740991,
            text: '',
          },
        },
        photoURL:
          'data:image/png;base64,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',
        summary: '',
        uid: 'RU7O9X65JTZ42t0ciJpx',
      },
      {
        activeTaskCount: 1,
        lastContacted: 1580730075890,
        name: 'gv aditya',
        notes: {
          '9007199254740991': {
            id: 9007199254740991,
            lastUpdated: 9007199254740991,
            text: '',
          },
        },
        photoURL: '',
        summary: '',
        uid: 'IxbQiHcJSpdLRTGYNe7q',
      },
    ];
    const send = jest.fn();
    const handleExistingSelection = jest.fn();
    const handleDuplicateSelection = jest.fn();
    const { getByTestId, findByText } = render(
      <MergeManager
        send={send}
        duplicates={duplicates}
        existingContacts={existingContacts}
        handleDuplicateSelection={handleDuplicateSelection}
        handleExistingSelection={handleExistingSelection}
      />
    );

    findByText(/1 \/ 2 duplicates/i);
    findByText(/abbey/i);
    // adds duplicate to resolved, with existing id
    userEvent.click(getByTestId(/existingContact/i));
    expect(handleExistingSelection).toHaveBeenCalledWith({
      activeTaskCount: 1,
      lastContacted: 34,
      name: 'abbey',
      notes: {
        '9007199254740991': {
          id: 9007199254740991,
          lastUpdated: 9007199254740991,
          text: '',
        },
      },
      photoURL: 'xxx',
      summary: '',
      uid: 'existingUid',
    });

    // increments index and proceed to next
    findByText(/gv aditya/i);
    // if existing, do nothing
    userEvent.click(getByTestId(/existingContact/i));
    expect(send).toHaveBeenCalled();
  });

  it('lets you overwrite existing contact data with new data in a conflict', () => {
    const duplicates = [
      {
        activeTaskCount: 1,
        lastContacted: 34,
        name: 'abbey',
        notes: {
          '9007199254740991': {
            id: 9007199254740991,
            lastUpdated: 9007199254740991,
            text: '',
          },
        },
        photoURL: '',
        summary: '',
        uid: 'skC92c6rKrw1rWGTqCuM',
      },
      {
        activeTaskCount: 1,
        lastContacted: 1580730075890,
        name: 'gv aditya',
        notes: {
          '9007199254740991': {
            id: 9007199254740991,
            lastUpdated: 9007199254740991,
            text: '',
          },
        },
        photoURL: '',
        summary: '',
        uid: 'IxbQiHcJSpdLRTGYNe7q',
      },
    ];
    const existingContacts = [
      {
        activeTaskCount: 1,
        lastContacted: 34,
        name: 'abbey',
        notes: {
          '9007199254740991': {
            id: 9007199254740991,
            lastUpdated: 9007199254740991,
            text: '',
          },
        },
        photoURL:
          'data:image/png;base64,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',
        summary: '',
        uid: 'existingUid',
      },
      {
        activeTaskCount: 1,
        lastContacted: 1580719638589,
        name: 'mouyyad abdulhadi',
        notes: {
          '9007199254740991': {
            id: 9007199254740991,
            lastUpdated: 9007199254740991,
            text: '',
          },
        },
        photoURL:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAbeUlEQVR4Xu1dW2xTx9ZOHMd2fL8nTkzuDe1J/8KRDi1CgBCChwr+l+YFQQQE8VhaIV6QeKj6gMQLQi19RNwEiJf0CdQHEEKAEC1HOtC/nJY0CYlx4sSO73YSO47za7nZdMfZl5ntHcB7LyTEOfXMmplvzbdnZq2ZtWqXlpb+twb/IAKIACcCtUgQnBmIAD8CSBCcHYiAAAJIEJweiAASBOcAIiANAVxBpOGGtVSCABJEJYrGYUpDAAkiDTespRIEkCAqUTQOUxoCSBBpuGEtlSCABFGJonGY0hBAgkjDDWupBAEkiEoUjcOUhgASRBpuWEslCCBBVKJoHKY0BJAg0nDDWipBAAmiEkXjMKUhgASRhhvWUgkCSBCVKBqHKQ0BJIg03LCWShBAgqhE0ThMaQggQaThhrVUggASRCWKxmFKQwAJIg03rKUSBJAgKlE0DlMaAkgQabhhLZUggARRiaJxmNIQQIJIww1rqQQBJIhKFI3DlIYAEkQablhLJQggQVSiaBymNASQINJww1oqQQAJohJF4zClIYAEkYYb1lIJAkgQlSgahykNASSINNywlkoQQIKoRNE4TGkIIEGk4Ya1VIIAEkQlisZhSkMACSINN6ylEgSQICpRNA5TGgJIEGm4YS2VIIAEeY8UncvlaqE7er1+6T3qlqq7ggR5D9QPxLh161bz8+fPW6A7GzZsmNi7d+8kEuXdKwcJ8o51cO/ePfeTJ0/88/PzOnZXDAZDfvPmzcGdO3fOvOMuqrp5JMg7VP/ly5c7R0dH3UJd6OzsnDl8+PDoO+ymqptGgrwD9Uej0frr1693z8zMWEiad7vd6QMHDgy7XK4FkvJYRj4EkCDyYUkkCchx6dKl9alUykhUYbmQ1WqdHRgYeIkkoUGt8rJIkMoxpJJw7ty53ng8bqKqtFzY4XBkjx8//kJKXawjDQEkiDTcJNW6cuVKx8jIiEdS5eVKXV1dkUOHDr2qRAbWJUcACUKOVUUlwVp1//79zoqELFfesWPHKFq35EBSXAYSRByjikvMzs5qzpw586+KBbEEnDx58t9Go7Eop0yUtRoBJMhbmBWDg4MtjBNQrubAmdjX1zchlzyUw40AEmSNZwZ4yU+fPr1pLZo5derUU/S2rwWyf8tEgqwtvjV37971PHjwoGMtmtm+ffurXbt2RdZCNsr8CwEkyBrPhPPnz38YiUSsa9GMx+NJHTt27I+1kI0ykSBrMgfAEQh/Z2dntblcTnPz5s1PtFrtYkNDg6xe8Lm5ufpCoVC3b9++X/V6fdFoNBbAiYiORHnViitIhXi+evWq4cWLF7axsTEbrBRLS0ulK+vwJ5lMGoPBYOmGLvypr68vGI3GjMViydpstlmapkFWOp02zc7OmhcWFrRMXb/fP8GWVVtbuwQrS3t7e7K3tzfZ0dExR9MOll2JABJE4ox4+PCh69mzZx6h7VMkErGHw2Fex6DT6Yx5vd5EXV3dIlc3FhcX68LhsD0Wizn5uun1eiMejyfB9zuQZePGjZFt27ZFJQ5V1dWQIJTq//nnn+2PHz9uIbkuEgwGvclk0ibURG1tbY3D4Yj5fL4VEzgUCrni8bhzaUn47ZTNZkv6/f6w2DDgmsqWLVsmPvvsM14yiclQ4+9IEAqtX7t2rW1oaKiRtEogEPDF43FHoVDQw7ZocXGxvlgsapaWluoYGbW1tUWNRrOo0+nmvF7vJPz3cDjcnM/nG4rFYt3S0pKGVXZRo9EU6+rqFmC7ptVqcw6HI97a2hoi7VNPT890f3//OGl5tZdDghDMgEAgYBgcHOwiWTVAHByg4/G4NRgMts/Pz5sJmpBcxGAwZPx+/5jD4UiRGgJgNenr6xtpbW2dl9ywSioiQUQUPTQ0ZLxx48Y/4MsvNidmZ2f1cO7IZDIls24qlXItLCzoxepV8nt9fX3OarWWtmdmszkF5xGj0ZgTkwkr0f79+//b09NDZSwQk6u035EgAhqFlePChQufkCh9YmLCnUgkHOyy6XTaAVslkvpSy8DWzGKxxNn17XZ7vKWlheip7tGjR3/FlYQffSSIwMwkebuRyWT0oVCoKZ/Pr3hTvrzVsoJZVurkJ6kHZuOGhoZUeVmdTpf3+XxTZrNZcDXBNybCKCNBePC5evVq+/DwsFcIvmg0apmenm7iszTl83nwXdhJJrrUMhaLJaHT6Ti3SWAha2xsnHK5XGkh+d3d3eGDBw+OSe2DkushQTi0C6bc27dv9wgpfmZmxjY9PS1IoGKxCIf1ih5IiU0+h8MR0Wg0gl76xsbGsNvtTgrJ2rNnzxCagFcjhAThmDVnz57tTSaTvM9iY7GYNRQKEZl74/F4I5hrxSa6lN/BPOxwOKZJ6vp8vmmn07lqK8bUtdls2RMnTuBz3jIwkSBlgICH/M6dO118ky6VSjW8fv3aTzIpoUw2m7XNz89LeoMu1obBYMiaTCbBlYEtY926dUGr1cp79WT37t0j6HFfiToSZBkP2FY9evSoBVYOrVZbKBQKb+47MZAVi8WakZGRNq4DOd9kLhQK9clkck22WTabLaLVaokvQcLBvaura1yjWW2xZsYMK8nWrVvR476sUCRITU0N14GciyTBYNCTTCapD93JZNIF3nSxFYHmd/Ci22w26vtVNpst4ff7V7wh4RorHtz/0oaqCSLmIWdPHNqtFXuy5/N5fTqddtEQQKysxWKJ6nQ6UYcglxz2VotvtYR66HFXMUHAQ37t2rWPxSYiM4HGxsaas9ms5LMEmHvB7CvWHsnvYNYF8y5JWa4yJpMp297ePilEDna9/v7+39TqcVflCgIrx8WLFz8muT4CEyWXy9UPDw+3S52QUA8uKMZiMSLLl1g7Tqdzura2lvOKvFhd5vfu7u4xvV5PdH6BaylHjhz5TY0ed1UShMRDDhMJtlWxWMwBKwfp11ZoguZyOUMmk+F920Eyuc1mc0yv11d0yZAZC6wkTqczLmTZYvqkVo+76ghCcmUdrFWTk5OrDuT5fL50/Vyn0xXg5R7JhC4vAyZfMP1KqQsmXTDtSqkLLx3z+bwWrtfrdLoVqw8c3Jubm8HhKChajVflVUUQEg85rBrgIecy5cJWa2Zmxr6wAM8x6hcMBkPObDbP6/X6PM2khSvw2WyWKpCDyWRKwdV2mnZyuZwuk8kY5ufn4T1Kqc9utzvBtbUCEzB43MVWE7V53FVFELGtlZiHHL7C4+PjPphoMOGYyQqPl2w2W8ZsNhNfHae5pyV034qLMJlMxphMJle8XWf63NbWFhJa/cQ87mrbaqmGIGIecpK7VTAZJyYmPMzXmE0S+A1WErjOQbqigBMxk8nY4aUh10SHl4NmszlB6gyEFQNIDv+y5THkgH9bWlpE42iJ3d1Sk8ddNQQRik8Ft3KnpqaaSLYv0WjUmk6nS1fYy1cS1oE2BSsKiTwow7Xlot1SwYoBrxjL22T30WKxZFwuF+99LHbdpqYm3lvAaorHpQqCQGieS5cu/Q/PdkQfCARaxYIjMHXh6xwKhd6kTeMjCWy3YL9PShLYvs3NzZX8LA0NDVkaIwCci2BbJUQO+M3n882Qrm5wVb61tTXA955kYGDg/9QQUkgVBLl161bTL7/80so1Wf/880+qu1XL2ywvOzYVH0lMJtOsUEgeUvIIlYMnvtlsVpQccE5qaWkRjX7CbgsO7h988AFngIdPP/00sHfv3ik5xvA+y1AFQX744Yf14XB4lWmV65ksibLgaw1fba59fnl9q9WaEbpmTtIeXxk4b6RSqVUvFrkIC6sZjRGBaZPv+a7X601++eWXLyvpfzXUVQVBvvnmm03siIegGAiw8OrVK85VhURxsM3iOwyX1/d4PHGTySRrhMNsNtsQiURWvIHnOxfBtgq2VyTj4irT0dERKA8EAVvAb7/99qlUmdVST/EEgTi533333T/LFTI+Pt7IRB+Roqzyswgjg2+71dbWNgVOOiltldcBZ+X4+PgqowJf2zRnD67+QbSUtra2VQ+zvv766/8oPRaw4gnCdSkR4laNjo5WdLcKJhKJ5YiZcDQWJDESsS1pYsSEeFk0FjW+tjs7O8fK426p4RKj4gny7Nkz648//vghW/GTk5OlsJ5iE5Hkd1ILEsiCr3Cllwzh0iOsfiTnH1pLmtB4ITxqc3PzivcnX3zxxR8bN24kMhuTYPk+llE8QeB6yY0bNzbC1RHYFsH78KmpqWZwzsGWB1IT1NXVQRjPBbHgB3wKJLUk2e32NPytZCIkEgkL/BVbOSqxoEGwCXBiLi4uwtPK0v0zcFo2NTVNwjt4ONOAhWv//v3PlB7oQZEEgbRnDx8+dP/++++u0dFRbyAQWMdMKKEnsMsxcuFu1Syp95qRS2JRkmJqLSfTxMTEGxMz35lDiuUMcMnlcsZ8Pm/gCzJR/sS3tbX1dWdnZ/ijjz6Kbtu2DXwski5wVvLBWOu6iiIIZJP96aeffOyEmeXnDdKLgvCktaGhIUPzao/EsgS+CCCKFMWC7wUIAnX5yEFrMYPXjnNzc2aSJ8Hl3v3ycwkkFv38889DSsq+qxiCCOUhf/HixQfMhKR92Qev98xmc5r07ADbkVgsZmauo5RvhVwuV8JisRBfamQTKZ1OG6PRqJ2LHGAEcDqdGVJLGZxlMpmMheaVY/lLxt7e3j+5iK6kPO6KIMiVK1c6RkZGeCOHDA0NdTCe70Qi4eG7HCj0Vad9qAQTELJCwarCtL18RT7vcrmIQ/Ww+xSNRiGEkI65JAkrEfhXIMMUKYFBntSHW3AOsdvtpcuO0HZPT88rPsy6uroihw4d4v1dygr6LupUNUHAx3H16tUesbQE7Ggk8OyVnZ+DBnSpD5aAIDCx8/k83NpdIr0wWN43MO9CoA2dTgdvUfJStmqVPNgCEsJzX+gXV3SU8v7C1fiDBw8OVbOvpGoJAuS4dOnS+lQqJRoIgZ0rMBqNNtOQorws7S1brrYWFxdr4FCs0WiWtFptkdkWWa3Wksk0lUqVbuXCdq1QKGiKxWItGA3q6ioL0Eh6/hLCx+VylZL8lOdG5KtjtVpnBwYGXlYrSaqWIN9///1HMzMzb8ydYpOeOYdUShBoh/YBU3nf2C8Tmd88Hs9kY2Njyc8wPT3tikQib4gs9BJQbNzM7zQPtEgIwnf+4KrrdrvTX3311e+kfX2fylUlQS5fvtw5Ojr65so5CaCQ8w+SYcpBkOUtBlVUQ3YfGWsUTHywlun1ejACLIHfAcqBXwbujuVyOcty+rb6SqxfckZ3hBUEko+W51QU00FnZ+fM4cOHR8XKvW+/Vx1BhKxVQuBCxtiXL192RqNRSFcgmi1KTFHsA6tY2fLfmbtUYEbW6/XZZDJpgXfjjP8B/DHw3t1ms6VzuZwJzLCV3OWSapgo7zdsBV0u19T69etH+TLzCmFRjdatqiIIOADPnj27AQ68tJMSysMqMjo6ul6KFYurvUrOIxCIzm63hyALLhze4SvPbgPOHHAYhyy2iUTCB4HepIxZjnMH0y58FDo7O1/Srh5MfTAsnDhx4nk1ORSriiCDg4MtbCeglAnz9OnTf87NzVFFFBFqx+l0CgZB4KubzWbhoF4zNTVVSo8AhGBIwvxvWEmampqmtVptjclEH9QRtmmxWMwnBSeuOpDJatOmTf+pRB44E/v6+iYqkfE261YNQWD1OH369KZKwYGLfuPj4ysuL1YiEyYNpEGjkQHWqmKxuBAIBBrZSXiY6y3s1QQCKLS2tk5rNJp6xrpF2hakf5PzY9DW1vYH17V30v4w5U6dOvW0WlYRJAitdsvKI0HoAUSC0GNGVAO3WEQwvSmEWyw6vLhKV80KAp3HQzq9wvGQTo8Zu0ZVEQQ6jmZeeoWjmZceM6ZG1REEOo6OQjqFo6OQDq+qXkGYzuNVEzql41UTOryqegWBzuNlRXqFy3EewcuK9Li/sxp43Z3+ZSJed6ebrlV5BikfIj6YwgdTdNOevLQiCCJm3cInt6snBD65JSOJYggCw8WgDTU1GLSBbOKTllIUQZhBY9gf+oDZGPaHmzKKJAh7qBg4jvRb+Xc5DBz3NxaKJwiGHiVP4iNEJQw9Sv+hqYoaGLwag1dXMlEVv4Jg+gO61GtckwnTH1RCsSqoiwl0MIGO1Gmq+BUEgMEUbDU1mIJNGkVUQRBM4vlXqFBM4klPElUQBNNA/zUxaFKxYRrovzBTBUFgoOfPn/8wEolwRjOJRqOWqampVTn/uL437PRnfCkIaNOecd2ypQ0pRJIOjiYNXFNT05TL5eJM9uPxeFLHjh37g/57XH01VEOQhw8fuu7cudPFp6KZmRkbO8IIX7mJiQkPRFfnIgdkXoKUz/AvyVQA73Umk7HzxemCOFRmszlBmswHMmhBIh++7LvQ55aWllJ0dqE/EEnF7XbzRqDfvXv3yLZt21akYxOTWa2/q4YgoKBz5871CkWCh8kVCoVW5P9jKxaCIIyPj/vKyQH7e0iUSZOHnOYBE20sYMjjDisKk3YBxsD0ua2tTTCOl8/nmxbK6w4R248fP/6iWic8bb9VRRC4dnL79u0eIZBSqVQDrCSQ07C8HDvo9HKuj5zZbIaUbUQrBiNPysMl2i0XtAUrSSaTMUBYU2bVA2uWXq9fKB8b5ByElcNqtQrmc9+zZ8+Q0vMSsrFRFUFg4NeuXWsbGhriXSWgTLFYrJmcnPQkk0k7G6x8Pl9KaKnT6QoQbJr2awTlK3mwJDU/CbQLq18+n9dCfF2dTrfI7jvk+mhubo5oNMIhi3t6eqb7+/vHpYy7WuuojiAkWy1GmbCaxGIxRzabNWm1kPC1UIq+LvWP1MxO7PZoM11x9ZUZi8lkyjqdzrjYqgEy1La1YnBTJUECgYDh4sWLHxeLRaIo77C1Gh4ebpdKjOUveB1kt6pEBlMXsjzRpFzjarO7u3uMa6vFVVaj0RSPHDnyW2tr67wc/a8mGaokCCiI6xKj0NcWorHDSiJVubTJQ4XaKU+mSdsnWDkgWjzpqtjf3/9bT0+PpMSjtH1738qrliCgCFhJBgcHu/gsW+wJBNut169f+6UoEFItp9Npl5S6fHUsFkuUJkU1W866deuCzLZKiCSwrerr6xtR48qh6i1W+aS7evVq+/DwcCn/OPOHa+Kwk4HSTPZkMukiyUNOIxMyU9lsNmpfBFfyTa6xdnd3hw8ePDhG0yclllX1CsJWKJiAHz161JJMJnkP5GDdGhkZaeMyAfNNDjmjGpa3YbPZqNLAgSm3q6trnMtaxZDEZrNlt27dOqEmU64QsZEgZeiIedxpt1rZbBZym0s+uwgpz2AwZMH0S/rlZm+tuOqoyUNOihkShAOps2fP9sJKwgeimMedXS8ej5cySJEqhKYcZKByOBylvOVif8Q85LBynDhxQjUecjG88AwigBCJx53k7hYEP4jH4x5SZUgp53A4wMG3yjPOliV2twrKqs1DToo1riA8SHEd3MuLwi3g6elpyJrLKYXmvhWpwsrLCd3TgivrjY2NvLdyGVl4IOdHHwkiMDPFLjdC1Uwmow+FQk1cB3fIDwh5AqVOfpJ6kB8R0sCVl4UDuc/nmzKbzTkhOWr1kJNgC2WQIAJIgZ/kwoULn5CAOTEx4U4kEg522XQ67cjn8w0k9aWW0el0cxaLJc6ub7fb4y0tLTMkMo8ePfqrmv0cYhghQUQQAo/7jRs3/kFyLWV2dlYfiUTsmUym9DArlUq5FhYW9GJKqOT3+vr6nNVqLflDIPqIx+NJGI1GwVUDysL1kf379/9XrR5yUsyRIARIiXncy0XMzc3B4dwaDAbb4Wo7QROSixgMhozf7x+DV4wNDQ2Ch3WmEfSQk8ONBCHHiuiqPFtcIBDwxeNxB3jR4fESvByElQgiqzPl4Po5mGthq+T1eifhv4fD4WbYmoF5GK7Xs8ouwpcfXhrCIy3wpjscjnhra2uIdBhqvLJOig1XOSQIJXpgAn78+HGL0MtERmQwGPQmk0mbUBNgaYKwnj6fb8W1kVAo5IrH404+Cxkj02azJf1+f1hsGLBqbNmyBT3kYkCV/Y4EoQSMKQ4e92fPnnn4AkFAOTiPhMNhXj+I0+mMeb3eRF1d3YoHTEwbi4uLdeFw2B6LxZx83fR6vRE4d/D9DgEWNm7cGFHLG3KJ6uSthgSpEFEIKfTixQvb2NiYDcgCL/cYkclk0hgMBluY/w/bIjDLWiyWrM1mo7o+DrLS6bQJzMbst+Z+v3+CLQteOgIp2tvbk729vcmOjg7BJ7QVDl/x1ZEgMqsYYgHD39nZWW0ul9PcvHnzE61Wu0h6gCbtDhgCCoVC3b59+37V6/VFo9FYcLlcC/CXVAaWE0cACSKOUUUlhOJxVSS4ppRNSjXxqSrFSmp9JIhU5Ajr3b171/PgwYMOwuJUxbZv3/5q165donGuqIRi4RUIIEHWeEJAOrjTp09vWotmTp069VSv10uKrrIW/VGiTCTIW9Dq4OBgy/Pnz98c1uVocsOGDRN9fX0TcshCGfwIIEHewuyA7Ltnzpz5l5xNnTx58t9Go7Eop0yUtRoBJMhbmhX37t1z379/v1OO5nbs2DG6c+dOosuIcrSnZhlIkLeo/StXrnSMjIxU9ICqq6srcujQoVdvsduqbgoJ8pbVT/LGhK9L+HbjLSsL34O8fcDBiXjp0qX1qVTKSNO61WqdHRgYeImOQBrUKi+LK0jlGFJLAJJcv369e2ZmxkJS2e12pw8cODCM5CBBS94ySBB58aSSdvny5c7R0VG3UKXOzs6Zw4cPj1IJxsKyIYAEkQ1KaYLAuvXkyRP//Pz8inwkBoMhv3nz5iBaq6ThKlctJIhcSFYgB7ztt27damacieAE3Lt37yR6ySsAVaaqSBCZgJRDDBAF5CAx5EBTHhlIEHlwRCkKRQAJolDF4rDkQQAJIg+OKEWhCCBBFKpYHJY8CCBB5MERpSgUASSIQhWLw5IHASSIPDiiFIUigARRqGJxWPIggASRB0eUolAEkCAKVSwOSx4EkCDy4IhSFIoAEkShisVhyYMAEkQeHFGKQhFAgihUsTgseRBAgsiDI0pRKAJIEIUqFoclDwJIEHlwRCkKRQAJolDF4rDkQQAJIg+OKEWhCCBBFKpYHJY8CCBB5MERpSgUASSIQhWLw5IHASSIPDiiFIUigARRqGJxWPIggASRB0eUolAEkCAKVSwOSx4EkCDy4IhSFIoAEkShisVhyYMAEkQeHFGKQhFAgihUsTgseRBAgsiDI0pRKAJIEIUqFoclDwJIEHlwRCkKRQAJolDF4rDkQQAJIg+OKEWhCCBBFKpYHJY8CCBB5MERpSgUASSIQhWLw5IHASSIPDiiFIUigARRqGJxWPIggASRB0eUolAEkCAKVSwOSx4E/h+XuD2nowiDNwAAAABJRU5ErkJggg==',
        summary: '',
        uid: 'RU7O9X65JTZ42t0ciJpx',
      },
      {
        activeTaskCount: 1,
        lastContacted: 1580730075890,
        name: 'gv aditya',
        notes: {
          '9007199254740991': {
            id: 9007199254740991,
            lastUpdated: 9007199254740991,
            text: '',
          },
        },
        photoURL: '',
        summary: '',
        uid: 'IxbQiHcJSpdLRTGYNe7q',
      },
    ];
    const send = jest.fn();
    const handleExistingSelection = jest.fn();
    const handleDuplicateSelection = jest.fn();
    const { getByTestId, findByText } = render(
      <MergeManager
        send={send}
        duplicates={duplicates}
        existingContacts={existingContacts}
        handleDuplicateSelection={handleDuplicateSelection}
        handleExistingSelection={handleExistingSelection}
      />
    );

    findByText(/1 \/ 2 duplicates/i);
    findByText(/abbey/i);
    // adds duplicate to resolved, with existing id
    userEvent.click(getByTestId(/newContact/i));
    expect(handleDuplicateSelection).toHaveBeenCalledWith({
      activeTaskCount: 1,
      lastContacted: 34,
      name: 'abbey',
      notes: {
        '9007199254740991': {
          id: 9007199254740991,
          lastUpdated: 9007199254740991,
          text: '',
        },
      },
      photoURL: '',
      summary: '',
      uid: 'existingUid',
    });

    // increments index and proceed to next
    findByText(/gv aditya/i);
    // if existing, do nothing
    userEvent.click(getByTestId(/existingContact/i));
  });

  it.skip('overwrite all existing works', () => {
    const duplicates = [
      {
        activeTaskCount: 1,
        lastContacted: 34,
        name: 'abbey',
        notes: {
          '9007199254740991': {
            id: 9007199254740991,
            lastUpdated: 9007199254740991,
            text: '',
          },
        },
        photoURL:
          'data:image/png;base64,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',
        summary: '',
        uid: 'skC92c6rKrw1rWGTqCuM',
      },
      {
        activeTaskCount: 1,
        lastContacted: 1580730075890,
        name: 'gv aditya',
        notes: {
          '9007199254740991': {
            id: 9007199254740991,
            lastUpdated: 9007199254740991,
            text: '',
          },
        },
        photoURL:
          'data:image/jpeg;base64,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',
        summary: '',
        uid: 'IxbQiHcJSpdLRTGYNe7q',
      },
      {
        email: 'info@abbieboudreau.com',
        lastContacted: 1580802153028,
        name: 'abbie',
        photoURL: 'https://ui-avatars.com/api/?name=abbie',
        uid: 'H6y2r5QvLLlr1ewlLkga',
      },
      {
        email: 'aa63aef7-3796-4300-9520-eb4e9f2a315c@tinyletter.com',
        lastContacted: 1580819384984,
        name: '',
        photoURL: 'https://ui-avatars.com/api/?name=',
        uid: 'hAADL89lVGXgFzsygaPJ',
      },
      {
        email: 'abyn@invisionapp.com',
        lastContacted: 1580819384987,
        name: '',
        photoURL: 'https://ui-avatars.com/api/?name=',
        uid: 'NmqAO6zElBHnndK1ngoa',
      },
      {
        email: 'academy@b9lab.com',
        lastContacted: 1580819384987,
        name: '',
        photoURL:
          'data:image/jpeg;base64,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',
        uid: 'Qv0HeZK3seFdx1penTam',
      },
      {
        email: 'Adila.Matra@mailtoday.in',
        lastContacted: 1580819384988,
        name: '',
        photoURL: 'https://ui-avatars.com/api/?name=',
        uid: 'ZygtZZv7AQNF6uVbSn82',
      },
      {
        email: 'activate@lww.com',
        lastContacted: 1580819384988,
        name: '',
        photoURL: 'https://ui-avatars.com/api/?name=',
        uid: 'pRIiMtk959aHy7Zuu3iz',
      },
    ];
    const existingContacts = [
      {
        activeTaskCount: 1,
        lastContacted: 34,
        name: 'abbey',
        notes: {
          '9007199254740991': {
            id: 9007199254740991,
            lastUpdated: 9007199254740991,
            text: '',
          },
        },
        photoURL:
          'data:image/png;base64,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',
        summary: '',
        uid: 'skC92c6rKrw1rWGTqCuM',
      },
      {
        activeTaskCount: 1,
        lastContacted: 1580719323081,
        name: 'Gingerspike Rosa',
        notes: {
          '9007199254740991': {
            id: 9007199254740991,
            lastUpdated: 9007199254740991,
            text: '',
          },
        },
        photoURL:
          'data:image/png;base64,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',
        summary: '',
        uid: 'irSX3pwAAhTlrpFiXPki',
      },
      {
        activeTaskCount: 1,
        lastContacted: 1580719638589,
        name: 'mouyyad abdulhadi',
        notes: {
          '9007199254740991': {
            id: 9007199254740991,
            lastUpdated: 9007199254740991,
            text: '',
          },
        },
        photoURL:
          'data:image/png;base64,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',
        summary: '',
        uid: 'RU7O9X65JTZ42t0ciJpx',
      },
      {
        activeTaskCount: 1,
        lastContacted: 1580730075890,
        name: 'gv aditya',
        notes: {
          '9007199254740991': {
            id: 9007199254740991,
            lastUpdated: 9007199254740991,
            text: '',
          },
        },
        photoURL:
          'data:image/jpeg;base64,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',
        summary: '',
        uid: 'IxbQiHcJSpdLRTGYNe7q',
      },
      {
        email: 'info@abbieboudreau.com',
        lastContacted: 1580802153028,
        name: 'abbie',
        photoURL: 'https://ui-avatars.com/api/?name=abbie',
        uid: 'H6y2r5QvLLlr1ewlLkga',
      },
      {
        email: 'aa63aef7-3796-4300-9520-eb4e9f2a315c@tinyletter.com',
        lastContacted: 1580819384984,
        name: '',
        photoURL: 'https://ui-avatars.com/api/?name=',
        uid: 'hAADL89lVGXgFzsygaPJ',
      },
      {
        email: 'info@abbigaylewarner.com',
        lastContacted: 1580819384986,
        name: 'abbigayle',
        photoURL: 'https://ui-avatars.com/api/?name=abbigayle',
        uid: 'fbjS0nxIbraU9YmzMzbh',
      },
      {
        email: 'abyn@invisionapp.com',
        lastContacted: 1580819384987,
        name: '',
        photoURL: 'https://ui-avatars.com/api/?name=',
        uid: 'NmqAO6zElBHnndK1ngoa',
      },
      {
        email: 'academy@b9lab.com',
        lastContacted: 1580819384987,
        name: '',
        photoURL:
          'data:image/jpeg;base64,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',
        uid: 'Qv0HeZK3seFdx1penTam',
      },
      {
        email: 'me@michaelacevedo.com',
        lastContacted: 1580819384987,
        name: 'michael acevedo',
        photoURL: 'https://ui-avatars.com/api/?name=michael acevedo',
        uid: 'sJ0SBWMpqMy3qNSTwHQg',
      },
      {
        email: 'biculturalmama@gmail.com',
        lastContacted: 1580819384988,
        name: 'maria adcock',
        photoURL:
          'data:image/jpeg;base64,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',
        uid: '4bSCgmXr9Sa6R5OpmCCN',
      },
      {
        email: 'Adila.Matra@mailtoday.in',
        lastContacted: 1580819384988,
        name: '',
        photoURL: 'https://ui-avatars.com/api/?name=',
        uid: 'ZygtZZv7AQNF6uVbSn82',
      },
      {
        email: 'activate@lww.com',
        lastContacted: 1580819384988,
        name: '',
        photoURL: 'https://ui-avatars.com/api/?name=',
        uid: 'pRIiMtk959aHy7Zuu3iz',
      },
      {
        email: 'contact@intelclinic.com',
        lastContacted: 1580819384988,
        name: 'ceo adamczyk',
        photoURL: 'https://ui-avatars.com/api/?name=ceo adamczyk',
        uid: 'ykhJapzAN3wlatxOk7Q9',
      },
      {
        email: 'mtnmedia@xmission.com',
        lastContacted: 1580820463140,
        name: 'jill adler!',
        photoURL: 'https://ui-avatars.com/api/?name=jill adler!',
        uid: 'oYdIFCJIkWgrTjRpu3Kr',
      },
    ];
  });

  it.skip('lets you revert a bulk merge', () => {
    const duplicates = [
      {
        activeTaskCount: 1,
        lastContacted: 34,
        name: 'abbey',
        notes: {
          '9007199254740991': {
            id: 9007199254740991,
            lastUpdated: 9007199254740991,
            text: '',
          },
        },
        photoURL: '',
        summary: '',
        uid: 'skC92c6rKrw1rWGTqCuM',
      },
      {
        activeTaskCount: 1,
        lastContacted: 1580730075890,
        name: 'gv aditya',
        notes: {
          '9007199254740991': {
            id: 9007199254740991,
            lastUpdated: 9007199254740991,
            text: '',
          },
        },
        photoURL: '',
        summary: '',
        uid: 'IxbQiHcJSpdLRTGYNe7q',
      },
    ];
    const existingContacts = [
      {
        activeTaskCount: 1,
        lastContacted: 34,
        name: 'abbey',
        notes: {
          '9007199254740991': {
            id: 9007199254740991,
            lastUpdated: 9007199254740991,
            text: '',
          },
        },
        photoURL:
          'data:image/png;base64,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',
        summary: '',
        uid: 'existingUid',
      },
      {
        activeTaskCount: 1,
        lastContacted: 1580719638589,
        name: 'mouyyad abdulhadi',
        notes: {
          '9007199254740991': {
            id: 9007199254740991,
            lastUpdated: 9007199254740991,
            text: '',
          },
        },
        photoURL:
          'data:image/png;base64,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',
        summary: '',
        uid: 'RU7O9X65JTZ42t0ciJpx',
      },
      {
        activeTaskCount: 1,
        lastContacted: 1580730075890,
        name: 'gv aditya',
        notes: {
          '9007199254740991': {
            id: 9007199254740991,
            lastUpdated: 9007199254740991,
            text: '',
          },
        },
        photoURL: '',
        summary: '',
        uid: 'IxbQiHcJSpdLRTGYNe7q',
      },
    ];

    const handleExistingSelection = jest.fn();
    const handleDuplicateSelection = jest.fn();
    const { getByTestId, findByText } = render(
      <MergeManager
        duplicates={duplicates}
        existingContacts={existingContacts}
        handleDuplicateSelection={handleDuplicateSelection}
        handleExistingSelection={handleExistingSelection}
      />
    );

    findByText(/1 \/ 2 duplicates/i);
    findByText(/abbey/i);
    // adds duplicate to resolved, with existing id
    userEvent.click(getByTestId(/newContact/i));
    expect(handleDuplicateSelection).toHaveBeenCalledWith({
      activeTaskCount: 1,
      lastContacted: 34,
      name: 'abbey',
      notes: {
        '9007199254740991': {
          id: 9007199254740991,
          lastUpdated: 9007199254740991,
          text: '',
        },
      },
      photoURL: '',
      summary: '',
      uid: 'existingUid',
    });

    // increments index and proceed to next
    findByText(/gv aditya/i);
    // if existing, do nothing
    userEvent.click(getByTestId(/existingContact/i));
  });
});

describe('people Box', () => {
  it.todo('if email adds email details to user box');
  it.todo('lets me add a social contact detail');
  it.todo('lets me remove a social contact detail');
  it.todo('avatars fall back');
  it.todo('uploaded image over  writes fall back avatar');
  it.todo('show email if email link exists');
  it.todo(
    'clicking on icon  reveals detail and close button, but hides email icon'
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
  it.todo('cypress tests');
});
