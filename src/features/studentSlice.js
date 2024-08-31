// src/redux/studentSlice.js
import { createSlice } from '@reduxjs/toolkit';

const studentSlice = createSlice({
  name: 'student',
  initialState: {
    enrolledCourses: [],
    likedCourses: [],
    completedCourses: [],
  },
  reducers: {
    enrollInCourse: (state, action) => {
      state.enrolledCourses.push(action.payload);
    },
    completeCourse: (state, action) => {
      const courseIndex = state.enrolledCourses.findIndex(course => course.id === action.payload.id);
      if (courseIndex !== -1) {
        state.enrolledCourses[courseIndex] = { ...state.enrolledCourses[courseIndex], isCompleted: true };
        state.completedCourses.push(state.enrolledCourses[courseIndex]);
        state.enrolledCourses = state.enrolledCourses.filter(course => course.id !== action.payload.id);
      }
    },
    likeCourse: (state, action) => {
      if (!state.likedCourses.some(course => course.id === action.payload.id)) {
        state.likedCourses.push(action.payload);
      }
    },
    unlikeCourse: (state, action) => {
      state.likedCourses = state.likedCourses.filter(course => course.id !== action.payload.id);
    },
    removeEnrolledCourse: (state, action) => {
      state.enrolledCourses = state.enrolledCourses.filter(course => course.id !== action.payload.id);
    },
    setEnrolledCourses: (state, action) => {
      state.enrolledCourses = action.payload;
    },
    setLikedCourses: (state, action) => {
      state.likedCourses = action.payload;
    },
    setCompletedCourses: (state, action) => {
      state.completedCourses = action.payload;
    },
  },
});

export const {
  enrollInCourse,
  completeCourse,
  likeCourse,
  unlikeCourse,
  removeEnrolledCourse,
  setEnrolledCourses,
  setLikedCourses,
  setCompletedCourses,
} = studentSlice.actions;

export default studentSlice.reducer;
