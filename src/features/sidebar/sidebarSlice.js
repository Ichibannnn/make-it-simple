import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isVisible: true,
  attachments: [],
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
    setAttachments: (state, action) => {
      state.attachments = action.payload;
    },
    resetSideBar: () => {
      return initialState;
    },
  },
});

export const { toggleSidebar, setSidebar, setAttachments, resetSideBar } = sidebarSlice.actions;
export default sidebarSlice.reducer;
