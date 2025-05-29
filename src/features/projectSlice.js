import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch projects from the backend
export const fetchProjects = createAsyncThunk(
  'project/fetchProjects',
  async () => {
    try {
      const response = await axios.get('https://back.apps1-fm-int.icloud.intel.com/api/projects'); // Ensure this is correct
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch projects',error);
    }
  }
);

const projectSlice = createSlice({
  name: 'project',
  initialState: {
    projects: [],
    selectedProjects: [],
    loading: false,
    error: null,
  },
  reducers: {
    selectProjects: (state, action) => {
      state.selectedProjects = action.payload; // Update selected projects
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projects = action.payload; // Store fetched data in Redux
        state.loading = false;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Set error if the request fails
      });
  },
});

export const { selectProjects } = projectSlice.actions;
export default projectSlice.reducer;
