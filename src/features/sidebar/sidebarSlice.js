import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isVisible: true,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isVisible = !state.isVisible;
    },
    setSidebar: (state, action) => {
      state.isVisible = action.payload;
    },
    resetSideBar: () => {
      return initialState;
    },
  },
});

export const { toggleSidebar, setSidebar, resetSideBar } = sidebarSlice.actions;
export default sidebarSlice.reducer;
