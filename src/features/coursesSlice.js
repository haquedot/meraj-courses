// src/store/courseSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { ref, onValue, update } from 'firebase/database';
import {database} from '../firebase';

const initialState = {
  list: [],
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setCourses: (state, action) => {
      state.list = action.payload;
    },
    updateLikes: (state, action) => {
      const course = state.list.find((c) => c.id === action.payload.id);
      if (course) {
        course.likes = action.payload.likes;
      }
    },
  },
});

export const { setCourses, updateLikes } = courseSlice.actions;

export const fetchCourses = () => (dispatch) => {
  const courseRef = ref(database, 'courses/');
  onValue(courseRef, (snapshot) => {
    const courses = [];
    snapshot.forEach((childSnapshot) => {
      courses.push({
        id: childSnapshot.key,
        ...childSnapshot.val(),
      });
    });
    dispatch(setCourses(courses));
  });
};

export const likeCourse = (courseId) => (dispatch, getState) => {
  const courseRef = ref(database, `courses/${courseId}`);
  const currentLikes = getState().courses.list.find((c) => c.id === courseId).likes || 0;
  update(courseRef, { likes: currentLikes + 1 });
};

export default courseSlice.reducer;
