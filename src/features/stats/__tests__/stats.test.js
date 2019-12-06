import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { cleanup, fireEvent, wait } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StatsBox from '../StatsBox';
import { render } from '../../../utils/testSetup';
import { Input } from '../Input';
import { IncomeBox } from '../InputForm';
import { Dashboard } from '../../../pages/Dashboard';

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

  test('modal closes to incomplete if no goal was added', async () => {
    const { getByTestId, queryByTestId } = render(
      <StatsBox userId={fakeData.userId} />,
      {
        initialState: { user: { stats: { goal: '' } } },
      }
    );
    expect(getByTestId('incomplete-screen')).toBeInTheDocument();
    expect(queryByTestId('contactModal')).not.toBeInTheDocument();
    userEvent.click(getByTestId('incomplete-screen'));

    await wait(() => expect(queryByTestId('contactModal')).toBeInTheDocument());
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

  test('there should be no saving indicator when the components loads the first time', () => {
    const { queryByText } = render(
      <Input
        name="test"
        userId="123"
        dispatch={() => {}}
        eventType="text"
        type="number"
      />,
      { user: { stats: { goal: 22 } } }
    );
    expect(queryByText(/Saved/i)).not.toBeInTheDocument();
  });

  test('modal closes to complete if goal is saved', () => {
    const { getByTestId, queryByTestId } = render(
      <StatsBox userId={fakeData.userId} />,
      {
        initialState: { user: { stats: { goal: '220', average: 53 } } },
      }
    );
    expect(getByTestId('complete-screen')).toBeInTheDocument();
    userEvent.click(getByTestId('statsTitle'));
    expect(queryByTestId('contactModal')).toBeInTheDocument();
    userEvent.click(getByTestId('closeModal'));
    expect(queryByTestId('contactModal')).not.toBeInTheDocument();
    expect(queryByTestId('incomplete-screen')).not.toBeInTheDocument();
    expect(queryByTestId('complete-screen')).toBeInTheDocument();
  });

  test('make sure statement updates', () => {
    const { getByTestId } = render(<StatsBox userId={fakeData.userId} />, {
      initialState: { user: { stats: { goal: 220, average: 53 } } },
    });
    expect(getByTestId('complete-screen')).toBeInTheDocument();
    userEvent.click(getByTestId('statsTitle'));
    expect(getByTestId('contactModal')).toBeInTheDocument();
    expect(getByTestId('incomeStatement')).toHaveTextContent(
      'Making $ 220 this year means completing 5 projects'
    );
  });

  test('error if the average is bigger than the goal', () => {
    const { getByTestId } = render(<StatsBox userId={fakeData.userId} />, {
      initialState: { user: { stats: { goal: 220, average: 5300 } } },
    });
    expect(getByTestId('complete-screen')).toBeInTheDocument();
    userEvent.click(getByTestId('statsTitle'));
    expect(getByTestId('contactModal')).toBeInTheDocument();
    expect(getByTestId('incomeStatement')).toHaveTextContent(
      'Making $ 220 this year means completing 1 projects'
    );
  });

  test('if complete says you are done', () => {
    const { getByTestId } = render(<StatsBox userId={fakeData.userId} />, {
      initialState: { user: { stats: { goal: 220, average: 53 } } },
    });

    userEvent.click(getByTestId('statsTitle'));
    expect(getByTestId('contactModal')).toBeInTheDocument();
    expect(getByTestId('contactModal')).toHaveTextContent(
      `You're done! The Hustle meter is set. You can close this modal now.`
    );
  });

  test('if complete the stats box should start in complete', () => {
    const { getByTestId } = render(<StatsBox userId={fakeData.userId} />, {
      initialState: { user: { stats: { goal: 220, average: 53 } } },
    });
    expect(getByTestId('complete-screen')).toBeInTheDocument();
  });

  describe('add existing income to hustle meter', () => {
    test('income bar appears when form complete', () => {
      const { getByTestId } = render(<StatsBox userId={fakeData.userId} />, {
        initialState: { user: { stats: { goal: 220, average: 53 } } },
      });

      userEvent.click(getByTestId('statsTitle'));
      expect(getByTestId('contactModal')).toBeInTheDocument();
      expect(getByTestId('incomeBar'));
    });
    test('income box appears when you update income', () => {
      const { getByTestId, queryByTestId } = render(
        <StatsBox userId={fakeData.userId} />,
        {
          initialState: { user: { stats: { goal: 220, average: 53 } } },
        }
      );

      userEvent.click(getByTestId('statsTitle'));
      expect(getByTestId('contactModal')).toBeInTheDocument();
      expect(getByTestId('incomeBar'));
      expect(queryByTestId('income')).not.toBeInTheDocument();
      userEvent.click(getByTestId('addIncome'));
      expect(getByTestId('income'));
    });

    test('income box fires income update', () => {
      const fakeDispatch = jest.fn();
      const { getByTestId, queryByTestId, getByText } = render(
        <IncomeBox dispatch={fakeDispatch} userId="123" />
      );
      expect(getByTestId('incomeBar'));
      expect(queryByTestId('income')).not.toBeInTheDocument();
      userEvent.click(getByTestId('addIncome'));
      expect(getByTestId('income'));
      userEvent.type(getByTestId('income'), 300, { allAtOnce: true });
      getByText('Saving...');
      expect(fakeDispatch).toHaveBeenCalled();
      expect(fakeDispatch).toHaveBeenCalledWith({
        type: 'FORM_SUBMITTED',
        payload: {
          name: 'income',
          value: 300,
          userId: '123',
        },
      });
    });

    test('if income exceed goals, then say you congratulations', () => {
      const { getByTestId } = render(<StatsBox userId={fakeData.userId} />, {
        initialState: {
          user: { stats: { goal: 220, average: 53, income: 500 } },
        },
      });

      userEvent.click(getByTestId('statsTitle'));
      expect(getByTestId('contactModal')).toHaveTextContent(
        'Congratulations! Making $ 220 this year means completing no more projects'
      );
    });

    test('if income exceed goals, then do not show hustle meter stats', () => {
      const { getByTestId, queryByTestId } = render(
        <StatsBox userId={fakeData.userId} />,
        {
          initialState: {
            user: { stats: { goal: 220, average: 53, income: 500 } },
          },
        }
      );
      getByTestId('statsTitle');
      expect(queryByTestId('statsDetails')).not.toBeInTheDocument();
    });
  });

  test('correct message appears for leads calculation in modal', () => {
    const { getByTestId } = render(<StatsBox userId={fakeData.userId} />, {
      initialState: { user: { stats: { goal: 220, average: 53, income: 20 } } },
    });

    userEvent.click(getByTestId('statsTitle'));
    expect(getByTestId('contactModal')).toBeInTheDocument();
    expect(getByTestId('hustleEstimate')).toHaveTextContent(
      `Landing 4 projects means you will need to pitch 12 leads, which means helping atleast 120 people.`
    );
  });

  xtest('cypress test that updating the crm changes the stats numbers', () => {});
});

describe('nice-to-have stats module features', () => {
  xtest('THE PRICE OF YOUR IDEAL PROJECT shoud link to services page/post', () => {});
  xtest('show you got paid sticker when ypu updat e income', () => {});
  xtest('average price should be pulled from your services', () => {});
  xtest('add tax deadline', () => {});
  xtest('infer tax date from location/link to locations and taxes dates', () => {});
  xtest('be able to change the currency', () => {});
});

// ###
xtest('add sentry', () => {});
xtest('upload images', () => {});
xtest('make rules work', () => {});
xtest('add a line to explain that you can create a website if you dont already have one', () => {});
