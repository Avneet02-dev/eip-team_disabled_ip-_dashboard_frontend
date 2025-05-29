import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "../features/projectSlice";
import emailReducer from '../features/emailSlice';
import archiveReducer from "../features/archiveSlice"; 
import searchReducer from "../features/searchSlice";

export const store = configureStore({
  reducer: {
    archive: archiveReducer,
    project: projectReducer,
    email: emailReducer,
    search:searchReducer
    
  },
});

export default store;
