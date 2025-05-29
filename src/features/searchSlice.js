// src/redux/slices/searchSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchValues: {},
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchValue: (state, action) => {
      const { columnId, value } = action.payload;
      state.searchValues[columnId] = value;
    },
    clearSearch: (state) => {
      state.searchValues = {};
    },
  },
});

export const { setSearchValue, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
