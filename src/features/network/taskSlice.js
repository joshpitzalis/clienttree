import { createSlice } from 'redux-starter-kit';
// import { toast$ } from '../notifications/toast';

export const taskSlice = createSlice({
  name: 'tasks',
  initialState: {},
  reducers: {
    setTasks(state, action) {
      const { payload } = action;
      const { theirUid, tasks } = payload;
      state[theirUid] = tasks;
    },
  },
});

// export const fetchTasks = (userId, contactId) => async dispatch => {
//   try {
//     const taskDetails = await getRepoDetails(org, repo);
//     dispatch(getRepoDetailsSuccess(repoDetails));
//   } catch (error) {
//     // dispatch(getRepoDetailsFailed(err.toString()));
//     toast$.next({ type: 'ERROR', message: error.message || error })
//   }
// };
