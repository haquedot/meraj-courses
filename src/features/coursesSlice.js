import { createSlice } from '@reduxjs/toolkit';
import { ref, onValue, push } from 'firebase/database';
import { database } from '../firebase';

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
    addCourseReview: (state, action) => {
      const { courseId, review } = action.payload;
      const course = state.list.find((c) => c.id === courseId);
      if (course) {
        if (!Array.isArray(course.reviews)) {
          course.reviews = [];
        }
        course.reviews.push(review);
      }
    },
    setCourseReviews: (state, action) => {
      const { courseId, reviews } = action.payload;
      const course = state.list.find((c) => c.id === courseId);
      if (course) {
        course.reviews = reviews;
      }
    },
  },
});

export const { setCourses, addCourseReview, setCourseReviews } = courseSlice.actions;

export const fetchCourses = () => (dispatch) => {
  const courseRef = ref(database, 'courses/');
  onValue(courseRef, (snapshot) => {
    const courses = [];
    snapshot.forEach((childSnapshot) => {
      const courseData = {
        id: childSnapshot.key,
        ...childSnapshot.val(),
      };

      // Fetch reviews for each course
      const reviewsRef = ref(database, `courses/${courseData.id}/reviews`);
      onValue(reviewsRef, (reviewSnapshot) => {
        const reviews = [];
        reviewSnapshot.forEach((reviewChild) => {
          reviews.push({
            id: reviewChild.key,
            ...reviewChild.val(),
          });
        });
        courseData.reviews = reviews;
      });

      courses.push(courseData);
    });
    dispatch(setCourses(courses));
  });
};


export const fetchCourseReviews = (courseId) => (dispatch) => {
  const reviewsRef = ref(database, `courses/${courseId}/reviews`);
  onValue(reviewsRef, (snapshot) => {
    const reviews = [];
    snapshot.forEach((childSnapshot) => {
      reviews.push({
        id: childSnapshot.key,
        ...childSnapshot.val(),
      });
    });
    dispatch(setCourseReviews({ courseId, reviews }));
  });
};

export const addReviewToCourse = (courseId, review) => (dispatch) => {
  const reviewRef = ref(database, `courses/${courseId}/reviews`);
  push(reviewRef, review).then(() => {
    dispatch(addCourseReview({ courseId, review }));
  }).catch((error) => {
    console.error('Error adding review to Firebase:', error);
  });
};

export default courseSlice.reducer;
