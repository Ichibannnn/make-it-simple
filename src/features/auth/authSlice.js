import { createSlice } from "@reduxjs/toolkit";

export const auth = createSlice({
  name: "auth",
  initialState: !!sessionStorage.getItem("token"),
  reducers: {
    signOut: () => {
      return false;
    },
    signIn: () => {
      return true;
    },
  },
});

export const { signOut, signIn } = auth.actions;

export default auth.reducer;
