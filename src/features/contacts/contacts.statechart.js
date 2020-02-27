import { Machine } from 'xstate';

const getPermissions = (ctx, event) => {
  console.log('frog');

  return setTimeout(() => Promise.resolve(), 3000);
};

export const contactMachine = Machine({
  id: 'contacts',
  initial: 'idle',
  states: {
    idle: {
      on: {
        CLICKED: 'loading',
        ALREADY_FETCHED: 'selector',
      },
    },
    // loading: {
    //   invoke: {
    //     id: 'getPermissions',
    //     src: () => setTimeout(() => Promise.resolve(), 3000),
    //     onDone: {
    //       target: 'selector',
    //       // actions: assign({ user: (context, event) => event.data }),
    //     },
    //     onError: {
    //       target: 'error',
    //       // actions: assign({ error: (context, event) => event.data }),
    //     },
    //   },
    // },
    loading: {
      after: {
        1000: { target: 'selector' },
      },
    },
    selector: {
      onEntry: ['deduplicate', 'preSelect', 'enrich'],
      on: {
        REVEALED_MORE: 'selector',
        // COMPLETED_FOR_NOW: 'idle',
        CLOSED: 'idle',
      },
      // states: {
      //   initial: 'idle',
      //   active: {
      //     on: {
      //       ARCHIVE: 'archived',
      //     },
      //   },
      //   archived: {
      //     on: {
      //       ACTIVATE: 'active',
      //       TRASH: 'trashed',
      //     },
      //   },
      //   trashed: {
      //     type: 'final',
      //   },
      // },
      // initial: 'idle',
      // states: {
      //   idle: {
      //     on: {
      //       SELECTED: 'selected',
      //       MAYBED: 'maybe',
      //       WHO_DISSED: 'who',
      //       TRASHED: 'trash',
      //     },
      //   },
      //   selected: {
      //     on: {
      //       CANCELLED: 'cancelled',
      //     },
      //   },
      //   who: {
      //     on: {
      //       CANCELLED: 'idle',
      //     },
      //   },
      //   maybe: {
      //     on: {
      //       CANCELLED: 'idle',
      //     },
      //   },
      //   trash: {
      //     on: {
      //       CANCELLED: 'idle',
      //     },
      //   },
      // },
    },
    error: {
      on: {
        RETRIED: 'loading',
      },
    },
  },
});
