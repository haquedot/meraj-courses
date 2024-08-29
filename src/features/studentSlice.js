// src/redux/studentSlice.js
import { createSlice } from '@reduxjs/toolkit';

const studentSlice = createSlice({
  name: 'student',
  initialState: {
    enrolledCourses: [],
  },
  reducers: {
    enrollInCourse: (state, action) => {
      state.enrolledCourses.push(action.payload);
    },
  },
});

export const { enrollInCourse } = studentSlice.actions;
export default studentSlice.reducer;
