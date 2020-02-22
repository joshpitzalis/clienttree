import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../utils/testSetup';
import ImportContacts from '../Contacts';
import {
  MergeManager,
  findMatchingExistingContact,
} from '../components/MergeManager';
import {
  parseContacts,
  handleContactSync,
  findConflicts,
  handleAddition,
} from '../contacts.helpers.js';

describe('contact chunker', () => {
  it('lets you fetch user with pictures from google', () => {});
  it.todo('deduplicates incoming contacts');
  it.todo('shows you 818 potential total contacts count in chunker modal');
  it.todo('if contact already exist shows up as selected');
  it.todo('shorlist 10 contacts');
  it.todo('send email');
  it.todo('connect email to app');
  it.todo('send email if import cancelled mid process');
});

describe('contact chunker phase 2', () => {
  it.todo('bucketing');
});
