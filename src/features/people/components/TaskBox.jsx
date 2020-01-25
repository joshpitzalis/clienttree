import React from 'react';
import { useMachine } from '@xstate/react';
import { Machine } from 'xstate';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import fromUnixTime from 'date-fns/fromUnixTime';
import { assert } from 'chai';
import { ACTIVITY_COMPLETED } from '../networkConstants';
import { ONBOARDING_STEP_COMPLETED } from '../../onboarding/onboardingConstants';
// state visualisation:
// https://xstate.js.org/viz/?gist=7925b7b6f194989221d4a2da62731937

export const taskMachine = Machine({
  id: 'task',
  initial: 'incomplete',
  states: {
    incomplete: {
      initial: 'upcoming',
      on: {
        COMPLETED: 'confirmation',
        // DELETED: 'deletion',
        ALREADY_COMPLETED: 'complete',
      },
      states: {
        upcoming: {
          on: {
            TASK_OVERDUE: 'overDue',
            TASK_DUE_TODAY: 'dueToday',
          },
        },
        dueToday: {},
        overDue: {},
      },
      meta: {
        test: ({ getByTestId }) => {
          assert.ok(getByTestId('incomplete'));
        },
      },
    },
    confirmation: {
      on: {
        COMPLETED: 'complete',
        CANCELLED: 'incomplete',
      },
      meta: {
        test: ({ getByTestId }) => {
          assert.ok(getByTestId('confirmation'));
        },
      },
    },
    // deletion: {
    //   on: {
    //     DELETED: 'deleted',
    //     CANCELLED: 'incomplete',
    //   },
    //   meta: {
    //     test: ({ getByTestId }) => {
    //       assert.ok(getByTestId('deletion'));
    //     },
    //   },
    // },
    complete: {
      entry: 'handleComplete',
      type: 'final',
    },
    // deleted: {
    //   type: 'final',
    // },
  },
});

const handleComplete = ({
  dispatch,
  taskId,
  myUid,
  completedFor,
  setSelectedUser,
  setVisibility,
}) => {
  dispatch({
    type: ACTIVITY_COMPLETED,
    payload: {
      taskId,
      myUid,
      completedFor,
      setSelectedUser,
      setVisibility,
    },
  });
  dispatch({
    type: ONBOARDING_STEP_COMPLETED,
    payload: {
      userId: myUid,
      onboardingStep: 'helpedSomeone',
    },
  });
};
/** @param {{
 taskId: string,
 name: string,
 dateCompleted?:number,
 myUid: string,
 completedFor: string,
 photoURL: string,
 dueDate: number
 setSelectedUser: function,
 setVisibility: function,
 dispatch: function,
 setComplete?: function,
}} [Props] */

export const TaskBox = ({
  taskId,
  name,
  dateCompleted,
  myUid,
  completedFor,
  setSelectedUser,
  setVisibility,
  photoURL,
  dispatch,
  dueDate,
  setComplete = handleComplete,
}) => {
  const [current, send] = useMachine(taskMachine, {
    actions: {
      handleComplete: () =>
        setComplete({
          dispatch,
          taskId,
          myUid,
          completedFor,
          setSelectedUser,
          setVisibility,
        }),
    },
  });

  React.useEffect(() => {
    //
    const now = +new Date();
    const oneDayInMilliseconds = 86400000;
    //
    if (dateCompleted) {
      send('ALREADY_COMPLETED');
    }
    if (dueDate < now) {
      send('TASK_OVERDUE');
    }
    if (dueDate < now + oneDayInMilliseconds) {
      send('TASK_DUE_TODAY');
    }
  }, [dateCompleted, dueDate, send]);

  return (
    <div
      className="mb3 pa2 taskBorder br3"
      key={taskId}
      data-state={
        current.value && current.value.incomplete
          ? current.value.incomplete
          : current.value
      }
      data-testid={current.value && current.value.incomplete}
    >
      <label
        htmlFor={name}
        className="lh-copy flex items-center justify-around  label relative pl3 pointer"
        style={{ minWidth: '100%' }}
        data-testid="incomplete"
      >
        <input
          className="taskBox"
          type="checkbox"
          id={name}
          data-testid={name}
          value={name}
          checked={current.value === 'complete'}
          onChange={() => send('COMPLETED')}
        />
        <span className="checkBox" data-state={current.value}></span>
        <div className="ph3 tl w-100">
          <p
            className={`${current.matches('complete') && 'strike'}`}
            data-testid={current.matches('complete') && 'complete'}
          >
            {name}
          </p>
          <small className="text3">{`Due ${formatDistanceToNow(
            fromUnixTime(dueDate / 1000),
            { addSuffix: true }
          )}`}</small>
        </div>
        <img src={photoURL} alt={name} height="25" className="br-100" />
      </label>
      {current.matches('confirmation') && (
        <div
          className="flex flex-column justify-center"
          data-testid="confirmation"
        >
          <button
            type="button"
            onClick={() => send('COMPLETED')}
            data-testid="confirmDelete"
            className="btn2 
           ph3 pv2 bn pointer br1 
           grow b
          "
          >
            Confirm Completed
          </button>
          <button
            type="button"
            onClick={() => send('CANCELLED')}
            className="bn pointer pv2 text3 bg-white"
          >
            Nevermind
          </button>
        </div>
      )}
    </div>
  );
};
