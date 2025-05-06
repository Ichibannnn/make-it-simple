import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  attachments: [],
};

const attachmentSlice = createSlice({
  name: "attachment",
  initialState,
  reducers: {
    setAttachments: (state, action) => {
      state.attachments = action.payload;
    },
  },
});

export const { setAttachments } = attachmentSlice.actions;
export default attachmentSlice.reducer;
