import { createSlice } from 'redux-starter-kit';
// import { toast$ } from '../notifications/toast';

export const taskSlice = createSlice({
  name: 'tasks',
  initialState: {},
  reducers: {
    setTasks(state, action) {
      const { payload } = action;
      const { theirUid, tasks: dbTasks } = payload;
      state[theirUid] = dbTasks;
    },
  },
});

// export function loadData(state, payload) {
//   // Create a Redux-ORM session from our entities "database tables" object
//   const session = orm.session(state);
//   // Get a reference to the correct version of the Pilots class for this Session
//   const {Pilot} = session;

//   const {pilots} = payload;
//   // Insert the Pilot entries into the Session
//   pilots.forEach(pilot => Pilot.parse(pilot));

//   // return a new version of the entities state object with the inserted entries
//   return session.state;
// }

// export const fetchTasks = (userId, contactId) => async dispatch => {
//   try {
//     const taskDetails = await getRepoDetails(org, repo);
//     dispatch(getRepoDetailsSuccess(repoDetails));
//   } catch (error) {
//     // dispatch(getRepoDetailsFailed(err.toString()));
//     toast$.next({ type: 'ERROR', message: error.message || error })
//   }
// };
