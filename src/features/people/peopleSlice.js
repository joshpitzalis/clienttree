import { createSlice } from '@reduxjs/toolkit';

const peopleSlice = createSlice({
  name: 'people',
  initialState: { selectedContact: '' },
  reducers: {
    setSelectedUser(state, action) {
      const { payload } = action;
      state.selectedContact = payload;
    },
    clearSelectedUser(state) {
      state.selectedContact = '';
    },
  },
});

export default peopleSlice;
