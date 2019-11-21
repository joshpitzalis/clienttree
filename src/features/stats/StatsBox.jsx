import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useMachine } from '@xstate/react';
import { Machine } from 'xstate';
import { assert } from 'chai';
import Portal from '../../utils/Portal';
import { GeneralForm } from './InputForm';
import { Stats } from './StatsDetails';

export const statsMachine = Machine(
  {
    id: 'stats',
    initial: 'incomplete',
    states: {
      incomplete: {
        on: { MODAL_OPENED: 'modal' },
        meta: {
          test: ({ getByTestId }) => {
            assert.ok(getByTestId('incomplete-screen'));
          },
        },
      },
      modal: {
        on: {
          CLOSED: [
            {
              target: 'complete',
              // Only transition to 'complete' if the guard (cond) evaluates to true
              cond: 'incomeGoalsCompleted',
            },
            { target: 'incomplete' },
            // {
            //   target: 'incomplete',
            //   cond: 'incomeGoalsCompleted',
            // },
            // { target: 'complete' },
          ],
        },
        meta: {
          test: ({ getByTestId }) => {
            assert.ok(getByTestId('contactModal'));
          },
        },
      },
      complete: {
        on: { COMPLETE_MODAL_OPENED: 'modal' },
        meta: {
          test: ({ getByTestId }) => {
            assert.ok(getByTestId('complete-screen'));
          },
        },
      },
    },
  },
  {
    guards: {
      incomeGoalsCompleted: (_, { payload }) => {
        if (payload && payload.incomeGoalsCompleted) {
          return true;
        }
        return false;
      },
    },
  }
);

const propTypes = {
  userId: PropTypes.string.isRequired,
};

const defaultProps = {};

export default function StatsBox({ userId }) {
  const userStats = useSelector(store => store.user);
  const [current, send] = useMachine(statsMachine);

  switch (current.value) {
    case 'incomplete':
      return (
        <button
          onClick={() => send('MODAL_OPENED')}
          type="button"
          className="bn tl pl4 mb6 pointer bg-transparent"
          data-testid="incomplete-screen"
        >
          <p className="underline b">Configure Your Hustle Meter</p>
          <small>
            Click here to figure out how many people you need to help out to
            reach your income goals this year.
          </small>
        </button>
      );
    case 'modal':
      return (
        <Portal onClose={() => send('CLOSED')}>
          {/* <InvoiceForm  /> */}
          <GeneralForm userId={userId} send={send} userStats={userStats} />
        </Portal>
      );
    case 'complete':
      return (
        <Stats
          userId={userId}
          userStats={userStats}
          showModal={() => send('COMPLETE_MODAL_OPENED')}
        />
      );
    default:
      return null;
  }
}

StatsBox.propTypes = propTypes;
StatsBox.defaultProps = defaultProps;
