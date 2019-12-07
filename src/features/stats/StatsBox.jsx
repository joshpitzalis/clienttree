import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useMachine } from '@xstate/react';
import { Machine } from 'xstate';
import { assert } from 'chai';
import Portal from '../../utils/Portal';
import { GeneralForm } from './InputForm';
import { Stats } from './StatsDetails';
import { setStatDefaults } from './statsAPI';
import Dollar from '../../images/Dollar';

export const statsMachine = Machine(
  {
    id: 'stats',
    initial: 'initialising',
    states: {
      initialising: {
        on: {
          INCOMPLETE: 'incomplete',
          ALREADY_COMPLETE: 'complete',
        },
      },
      incomplete: {
        on: {
          MODAL_OPENED: 'loading',
        },
        meta: {
          test: ({ getByTestId }) => {
            assert.ok(getByTestId('incomplete-screen'));
          },
        },
      },
      loading: {
        invoke: {
          id: 'setRatioDefaultsInFirebase',
          src: (context, event) =>
            setStatDefaults(event.payload && event.payload.userId),
          onDone: {
            target: 'modal',
          },
          onError: {
            target: 'incomplete',
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

  // if the hustle meter is already set up go straight to the complete state
  React.useEffect(() => {
    if (userStats.stats && userStats.stats.goal && userStats.stats.average) {
      send('ALREADY_COMPLETE');
    } else {
      send('INCOMPLETE');
    }
  }, [userStats, send]);

  switch (current.value) {
    case 'incomplete':
      return (
        <button
          onClick={() => send({ type: 'MODAL_OPENED', payload: { userId } })}
          type="button"
          className="bn tl pa2 pointer bg-base br3 black w5 fixed mt7 ml2 br--top"
          style={{ bottom: 0 }}
          data-testid="incomplete-screen"
        >
          <p className="b pointer"> Configure Your Hustle Meter</p>
          <div className="flex">
            <Dollar className="w3" />
            <small className="pl2">
              Figure out how many people you need to help if you want to reach
              your income goals this year.
            </small>
          </div>
        </button>
      );
    case 'modal':
      return (
        <Portal
          onClose={() =>
            // send('CLOSED')
            send({
              type: 'CLOSED',
              payload: {
                incomeGoalsCompleted:
                  userStats.stats &&
                  userStats.stats.goal &&
                  userStats.stats.average,
              },
            })
          }
        >
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
