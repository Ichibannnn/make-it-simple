import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openTickets: [],
};

const webTickets = createSlice({
  name: "root",
  initialState,
  reducers: {
    setOpenTickets: (state, action) => {
      state.openTickets = action.payload;
    },
    resetTickets: () => initialState,
  },
});

export const { setOpenTickets, resetTickets } = webTickets.actions;
export default webTickets.reducer;
