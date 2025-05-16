import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchValue: "",
  status: "",
  isLoading: false,
  ascending: true,
  pageNumber: 1,
  pageSize: 5,
};

const rootSlice = createSlice({
  name: "root",
  initialState,
  reducers: {
    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
    setStatus: (state, action) => {
      state.isLoading = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setAscending: (state, action) => {
      state.ascending = action.payload;
    },
    setPageNumber: (state, action) => {
      state.pageNumber = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
  },
});

export const { setSearchValue, setStatus, setIsLoading, setAscending, setPageNumber, setPageSize } = rootSlice.actions;
export default rootSlice.reducer;
