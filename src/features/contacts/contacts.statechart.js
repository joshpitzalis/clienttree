import { Machine } from 'xstate';

// const fetchContacts = (ctx, event) => {

//   return setTimeout(() => Promise.resolve(), 3000);
// };

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
    //     src: fetchContacts,
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
    },
    error: {
      on: {
        RETRIED: 'loading',
      },
    },
  },
});
