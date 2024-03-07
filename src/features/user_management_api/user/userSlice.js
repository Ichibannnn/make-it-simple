import { createSlice } from "@reduxjs/toolkit";

export const user = createSlice({
  name: "user",
  initialState: JSON.parse(localStorage.getItem("user")),
  reducers: {
    setUserDetails: (_, action) => {
      return action.payload;
    },
    clearUserDetails: () => {
      return null;
    },
  },
});

export const { setUserDetails, clearUserDetails } = user.actions;

export default user.reducer;
