import { createSlice } from "@reduxjs/toolkit";

export const auth = createSlice({
  name: "auth",
  initialState: !!localStorage.getItem("token"),
  reducers: {
    signIn: () => {
      return true;
    },
  },
});

export const { signIn } = auth.actions;

export default auth.reducer;
