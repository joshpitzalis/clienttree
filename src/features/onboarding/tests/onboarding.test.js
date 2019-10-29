import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { GettingStarted } from '../GettingStarted';
import { Dashboard } from '../../../pages/Dashboard';
// import 'react-testing-library/cleanup-after-each';
import { rootReducer } from '../../../utils/store';

function render(
  ui,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
    initialState,
    store = createStore(rootReducer, initialState),
    ...renderOptions
  } = {}
) {
  return {
    ...rtlRender(
      <Provider store={store}>
        <Router history={history}>{ui}</Router>
      </Provider>,
      renderOptions
    ),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history,
    // adding `store` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    store,
  };
}

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
