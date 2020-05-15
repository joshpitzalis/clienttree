import { createSlice } from '@reduxjs/toolkit'

export const taskSlice = createSlice({
  name: 'tasks',
  initialState: [],
  reducers: {
    setTasks (state, action) {
      const { payload } = action
      // // flatten nested timestamps coming from firestore
      // const newTasks = payload.map(_task => ({
      //   ..._task,
      //   dateCreated: _task.dateCreated && _task.dateCreated.nanoseconds,
      //   dateCompleted: _task.dateCompleted && _task.dateCompleted.nanoseconds,
      // }));
      return payload
    }
  }
})
