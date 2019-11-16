import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { fireEvent } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import { GettingStarted } from '../GettingStarted';
import { Dashboard } from '../../../pages/Dashboard';
// import 'react-testing-library/cleanup-after-each';
import { Onboarding } from '../ActivityList';
import { render } from '../../../utils/testSetup';

test('shows first task completed when you start', () => {
  const { getByLabelText } = render(<GettingStarted />);
  expect(getByLabelText(/Sign up to Client Tree/i)).toBeEnabled();
});

xtest('when you create a signature the onboarding task gets marked complete', () => {
  const { getByTestId, queryByTestId } = render(<Dashboard />);
  expect(queryByTestId('profileHeader')).toBeNull();

  fireEvent.click(getByTestId('linkToServices'));
  // userEvent.click(getByTestId('linkToServices'));
  expect(getByTestId('profileHeader')).toBeInTheDocument();
});

xtest('add a skip feature to sending email', () => {});
xtest('let people mark sending email complete', () => {});
xtest('complete referrla page once servicea  are  added', () => {});
xtest('complete crm task when one client is added to network', () => {});
xtest('add a helpful task to a client', () => {});
xtest('mark a helpful task complete', () => {});
xtest('set up financials', () => {});

xtest('says getting staretd bt then switches to acticities when setup is complete', () => {});
xtest('hides onboarding box when complete', () => {});

xtest('completePercentage is accurate', () => {});
xtest('completePercentage undates when completed or incompleted', () => {});

describe('Shanu feedback', () => {
  xtest('onboarding block lets you know it will disappear, and that you can take a few days to complete', () => {
    const { getByTestId } = render(<Onboarding />);
    expect(getByTestId('onboardingHelpText')).toBeInTheDocument();
  });

  xtest('uncheck or skip voluntary tasks, non-disabled, and tehn check that teh total count test stsill work to make the module disappear on completion', () => {});
});
