import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedArchiveRows: [],  // Stores selected rows for archiving
};

const archiveSlice = createSlice({
  name: "archive",
  initialState,
  reducers: {
    // Select all rows for archiving (selects all rows currently displayed)
    selectAllArchives: (state, action) => {
      // Action payload will be an array of project IDs from the currently displayed rows
      state.selectedArchiveRows = action.payload;
    },

    // Deselect all rows from archiving
    deselectAllArchives: (state) => {
      state.selectedArchiveRows = [];
    },

    // Toggle selection of a single row for archiving
    toggleArchiveSelection: (state, action) => {
      const projectId = action.payload;

      // If the projectId exists in selectedArchiveRows, remove it, otherwise add it
      if (state.selectedArchiveRows.includes(projectId)) {
        state.selectedArchiveRows = state.selectedArchiveRows.filter(id => id !== projectId);
      } else {
        state.selectedArchiveRows.push(projectId);
      }
    },

    // Reset the selected archive rows (for example, after archiving them)
    resetArchiveSelection: (state) => {
      state.selectedArchiveRows = [];
    },
  },
});

export const {
  selectAllArchives,
  deselectAllArchives,
  toggleArchiveSelection,
  resetArchiveSelection,
} = archiveSlice.actions;

export default archiveSlice.reducer;
