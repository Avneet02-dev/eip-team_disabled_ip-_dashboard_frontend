import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedEmailRows: [], // Track selected row IDs
};

const emailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {
    toggleEmailSelection: (state, action) => {
      const rowId = action.payload; 
      if (state.selectedEmailRows.includes(rowId)) {
        state.selectedEmailRows = state.selectedEmailRows.filter((id) => id !== rowId);
      } else {
        state.selectedEmailRows.push(rowId);
      }
    },
    selectAllEmails: (state, action) => {
      state.selectedEmailRows = action.payload; // Store all row IDs
    },
    deselectAllEmails: (state) => {
      state.selectedEmailRows = []; // Clear selection
    },
   
  },
});

export const { toggleEmailSelection, selectAllEmails, deselectAllEmails} =
  emailSlice.actions;
export default emailSlice.reducer;
