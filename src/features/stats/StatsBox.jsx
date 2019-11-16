import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useMachine } from '@xstate/react';
import { Machine } from 'xstate';
import Portal from '../../utils/Portal';
import { GeneralForm } from './InputForm';
import { Stats } from './StatsDetails';

const incomeGoalsCompleted = (_, { payload }) => {
  if (payload.incomeGoalsCompleted) {
    return true;
  }

  return false;
};

const statsMachine = Machine({
  id: 'stats',
  initial: 'incomplete',
  states: {
    incomplete: {
      on: { MODAL_OPENED: 'modal' },
    },
    modal: {
      on: {
        CLOSED: [
          {
            target: 'complete',
            // Only transition to 'complete' if the guard (incomeGoalsCompleted) evaluates to true
            cond: incomeGoalsCompleted,
          },
          { target: 'incomplete' },
        ],
      },
    },
    complete: {
      on: { MODAL_OPENED: 'modal' },
    },
  },
});

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
          className="bn tl pl4 mb6 pointer"
        >
          <p className="underline b">Income Calculator</p>
          <small>
            Click here to figure out how many people you need to help out to
            reach your income goals this year.
          </small>
        </button>
      );
    case 'modal':
      return (
        <Portal>
          {/* <InvoiceForm  /> */}
          <GeneralForm userId={userId} send={send} userStats={userStats} />
        </Portal>
      );
    case 'complete':
      return (
        <Stats
          userId={userId}
          userStats={userStats}
          showModal={() => send('MODAL_OPENED')}
        />
      );
    default:
      return null;
  }
}

StatsBox.propTypes = propTypes;
StatsBox.defaultProps = defaultProps;
