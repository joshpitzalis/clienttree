import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { render } from '../../../utils/testSetup';
import {
  findMatchingExistingContact,
  MergeManager,
} from '../components/MergeManager';
import ImportContacts from '../Contacts';
import {
  findConflicts,
  handleAddition,
  handleContactSync,
  parseContacts,
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

describe('contact Importer', () => {
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

  it('pareses replaces any blank names with email addresses for incoming contacts', () => {
    const contacts = [
      {
        first_name: '',
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
        __selectedMail__: ' Abbey@example.com ',
        __selectedPhone__: '',
        __selectedAddress__: '',
        __letter__: 'a',
      },
    ];
    const result = [{ name: 'abbey@example.com', email: 'abbey@example.com' }];
    // ensures lower case and white space trimming
    expect(parseContacts(contacts)).toEqual(result);
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
        email: 'abbey@example.com',
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
});

describe('Merging conflicts', () => {
  describe('determine contact conflicts', () => {
    // NAME_MATCHES      EMAIL_MATCHES    CONFLICT
    // true              true             false (identical)
    // true              false            true
    // false             true             true
    // false             false            false

    it('name Match and Email match results in no conflict', () => {
      const existingContacts = [{ name: 'abbey', email: 'abbey@example.com' }];

      const newContacts = [{ name: 'abbey', email: 'abbey@example.com' }];

      const duplicates = [];

      expect(findConflicts(newContacts, existingContacts)).toEqual(duplicates);
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

      const duplicates = [{ name: 'abbey', email: 'different@example.com' }];

      expect(findConflicts(newContacts, existingContacts)).toEqual(duplicates);
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

      const duplicates = [{ name: 'abbey4', email: 'abbe@example.com' }];

      expect(findConflicts(newContacts, existingContacts)).toEqual(duplicates);
    });

    it('names do NOT Match and Emails do NOT match results in no conflict', () => {
      const existingContacts = [{ name: 'abbey1', email: 'abbe3@example.com' }];

      const newContacts = [{ name: 'abbey2', email: 'abbe4@example.com' }];

      const duplicates = [];

      expect(findConflicts(existingContacts, newContacts)).toEqual(duplicates);
    });

    // blank fields edge cases

    it('if contacts have the same name but new contact has a blank email then it should NOT count as a conflict', () => {
      const existingContacts = [{ name: 'abbey', email: 'abbey@example.com' }];

      const newContacts = [{ name: 'abbey', email: '' }];

      const duplicates = [];

      expect(findConflicts(newContacts, existingContacts)).toEqual(duplicates);
    });

    it('if contacts have the same name but existing contact has a blank email then it should count as a conflict ', () => {
      const existingContacts = [{ name: 'abbey', email: '' }];

      const newContacts = [{ name: 'abbey', email: 'abbey@example.com' }];

      const duplicates = [{ name: 'abbey', email: 'abbey@example.com' }];

      expect(findConflicts(newContacts, existingContacts)).toEqual(duplicates);
    });

    it('if contacts have the same email but new contact has a blank name then it should NOT count as a conflict', () => {
      const existingContacts = [{ name: 'abbey', email: 'abbey@example.com' }];

      const newContacts = [{ name: '', email: 'abbey@example.com' }];

      const duplicates = [];

      expect(findConflicts(newContacts, existingContacts)).toEqual(duplicates);
    });

    it('if contacts have the same email but existing contact has a blank name then it should count as a conflict', () => {
      const existingContacts = [{ name: '', email: 'abbey@example.com' }];

      const newContacts = [{ name: 'abbey', email: 'abbey@example.com' }];

      const duplicates = [{ name: 'abbey', email: 'abbey@example.com' }];

      expect(findConflicts(newContacts, existingContacts)).toEqual(duplicates);
    });

    it('if contacts have the same email but new contact has a blank name then it should NOT count as a conflict', () => {
      const existingContacts = [{ name: 'abbey', email: 'abbey@example.com' }];

      const newContacts = [{ name: '', email: 'abbey@example.com' }];

      const duplicates = [];

      expect(findConflicts(newContacts, existingContacts)).toEqual(duplicates);
    });
  });

  describe('findMatchingExistingContact', () => {
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
  });

  it('adds a contacts when you click on the new contacts, and overwrite existing contact data with new data in a conflict, increments the merge box, does nothing when you click on the existing contact, and closes conflict box when no more conflicts', () => {
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
    expect(handleExistingSelection).toHaveBeenCalledWith({
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
    });

    expect(send).toHaveBeenCalledWith('CLOSED');
  });

  it.skip('skip all', () => {
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

    findByText(/Keep all existing contacts/i);
  });
  it.skip('merge all');

  it.todo('when you add someone new they should be long over due');

  it.todo(
    'when you merge a conflict the last contacted date should be untouched'
  );

  it.todo('overwrite all existing works');

  it.todo('lets you revert a bulk merge');
});

describe('contact Card', () => {
  it.todo('does increment? card contact');
  it.todo('if last? card contact');
  it.todo('if existing and last? card contact');
  it.todo('fires correct if existing');
  it.todo('fires correct if not existing?');
});
