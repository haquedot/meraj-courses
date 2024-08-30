import { configureStore } from '@reduxjs/toolkit';
import courseReducer from '../features/coursesSlice';
import studentReducer from '../features/studentSlice';
import authReducer from '../features/authSlice';

// Create and export the Redux store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    student: studentReducer,
  },
  // Optionally allow non-serializable data
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Allow non-serializable data if necessary
    }),
});
