import React from 'react';
import { useMachine } from '@xstate/react';
import { Machine } from 'xstate';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import fromUnixTime from 'date-fns/fromUnixTime';
import { ACTIVITY_COMPLETED } from '../networkConstants';
import { ONBOARDING_STEP_COMPLETED } from '../../onboarding/onboardingConstants';

// state visualisation:
// https://xstate.js.org/viz/?gist=7925b7b6f194989221d4a2da62731937

const taskMachine = Machine({
  id: 'task',
  initial: 'incomplete',
  states: {
    incomplete: {
      initial: 'upcoming',
      on: {
        COMPLETED: 'complete',
        DELETED: 'confirmation',
      },
      states: {
        upcoming: {
          on: {
            TASK_OVERDUE: 'overDue',
            TASK_DUE_TODAY: 'dueToday',
          },
        },
        dueToday: {
          on: {
            CLOSED: { target: 'dueToday', actions: ['clearSelectedUser'] },
          },
        },
        overDue: {
          on: {
            CLOSED: { target: 'dueToday', actions: ['clearSelectedUser'] },
          },
        },
      },
    },
    confirmation: {
      on: {
        DELETED: 'complete',
        CANCELLED: 'incomplete',
      },
    },
    complete: {
      type: 'final',
    },
  },
});

/** @param {{
 taskId: string,
 name: string,
 dateCompleted:number,
 myUid: string,
 completedFor: string,
 setSelectedUser: function,
 setVisibility: function,
 photoURL: string,
 dispatch: function,
 dueDate: number
}} [Props] */

export function TaskBox({
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
}) {
  const [current, send] = useMachine(taskMachine, {
    actions: {
      setSelectedUser: (ctx, event) =>
        dispatch({ type: 'people/setSelectedUser', payload: event.payload }),
      clearSelectedUser: () => dispatch({ type: 'people/clearSelectedUser' }),
    },
  });

  React.useEffect(() => {
    //
    const now = +new Date();
    const oneDayInMilliseconds = 86400000;
    //
    if (dueDate < now) {
      send('TASK_OVERDUE');
    }
    if (dueDate < now + oneDayInMilliseconds) {
      send('TASK_DUE_TODAY');
    }

    if (dateCompleted) {
      send('COMPLETED');
    }
  }, [dateCompleted, dueDate, send]);

  return (
    <div className="mb3" key={taskId}>
      <label
        htmlFor={name}
        data-state={current.value}
        className="lh-copy flex items-center justify-around br3 bg-white taskBorder label relative pl3 pointer"
        style={{ minWidth: '100%' }}
      >
        <input
          className="taskBox"
          type="checkbox"
          id={name}
          data-testid={name}
          value={name}
          checked={current.value === 'complete'}
          onChange={() => {
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
          }}
        />
        <span className="checkBox" data-state={current.value}></span>
        <div className="ph3 tl w-100">
          <p className={`${current.value === 'complete' && 'strike'}`}>
            {name}
          </p>
          <small className="text3">{`Due ${formatDistanceToNow(
            fromUnixTime(dueDate / 1000),
            { addSuffix: true }
          )}`}</small>
        </div>
        <img src={photoURL} alt={name} height="25" className="br-100" />
      </label>
    </div>
  );
}
