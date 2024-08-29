// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import courseReducer from '../features/coursesSlice';
import studentReducer from '../features/studentSlice';

export const store = configureStore({
  reducer: {
    courses: courseReducer,
    student: studentReducer,
  }
});
