import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StatsBox from '../StatsBox';
import { render } from '../../../utils/testSetup';
import { Input } from '../Input';

afterEach(cleanup);

describe('stats box', () => {
  const fakeData = {
    userId: '123',
  };

  test('box hides till you enter an income goal', () => {
    const { getByTestId, queryByTestId } = render(
      <StatsBox userId={fakeData.userId} />
    );
    expect(getByTestId('incomplete-screen')).toBeInTheDocument();
    expect(queryByTestId('contactModal')).not.toBeInTheDocument();
    expect(queryByTestId('complete-screen')).not.toBeInTheDocument();
  });

  test('modal closes to incomplete if no goal was added', () => {
    const { getByTestId, queryByTestId } = render(
      <StatsBox userId={fakeData.userId} />
    );
    expect(getByTestId('incomplete-screen')).toBeInTheDocument();
    expect(queryByTestId('contactModal')).not.toBeInTheDocument();
    userEvent.click(getByTestId('incomplete-screen'));
    expect(queryByTestId('contactModal')).toBeInTheDocument();
    userEvent.click(getByTestId('closeModal'));
    expect(queryByTestId('contactModal')).not.toBeInTheDocument();
    expect(getByTestId('incomplete-screen')).toBeInTheDocument();
    expect(queryByTestId('complete-screen')).not.toBeInTheDocument();
  });
  test('auto save on input', () => {
    const dispatch = jest.fn();
    const { getByTestId, getByText, queryByText } = render(
      <Input
        name="test"
        userId="123"
        dispatch={dispatch}
        eventType="text"
        type="number"
      />
    );
    expect(queryByText('Saving...')).not.toBeInTheDocument();
    userEvent.type(getByTestId('test'), 123, { allAtOnce: true });
    getByText('Saving...');
    expect(dispatch).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith({
      type: 'text',
      payload: {
        name: 'test',
        value: 123,
        userId: '123',
      },
    });
  });
  test('no text in numbers inputs', () => {
    const dispatch = jest.fn();
    const { getByTestId, getByText, queryByText } = render(
      <Input
        name="test"
        userId="123"
        dispatch={dispatch}
        eventType="text"
        type="number"
      />
    );

    expect(queryByText(/Numbers only please/i)).not.toBeInTheDocument();
    fireEvent.keyDown(getByTestId('test'), {
      key: 'A',
      code: 65,
      charCode: 65,
    });
    getByText(/Numbers only please/i);
    expect(dispatch).not.toHaveBeenCalled();
  });
  xtest('no saving if input is blank', () => {});
  xtest('does not show saved on first run', () => {});

  xtest('modal closes to complete if goal is saved', () => {});
  xtest('goes back to incomplete if a goal is removed', () => {});
  xtest('average price should be pulled from your services', () => {});
  xtest('teh hustle meter should appear in a nav right', () => {});

  xtest('infer tax date from location/link to locations and taxes dates', () => {});
  xtest('be able to change the currency', () => {});
});
