// src/utils/database.js
import { ref, set, get, onValue } from 'firebase/database';
import { database } from '../firebase';

export const saveEnrolledCourses = (userId, courses) => {
  set(ref(database, 'users/' + userId + '/enrolledCourses'), courses)
    .then(() => {
      console.log('Courses saved successfully.');
    })
    .catch((error) => {
      console.error('Error saving courses:', error);
    });
};

export const fetchEnrolledCourses = async (userId) => {
  try {
    const enrolledCoursesRef = ref(database, `users/${userId}/enrolledCourses`);
    const snapshot = await get(enrolledCoursesRef);

    if (snapshot.exists()) {
      const enrolledCoursesData = snapshot.val();
      const courseIds = Object.keys(enrolledCoursesData);

      // Fetch course details for each enrolled course
      const courses = await Promise.all(
        courseIds.map(async (courseId) => {
          const courseRef = ref(database, `courses/${courseId}`);
          const courseSnapshot = await get(courseRef);
          return { id: courseId, ...(courseSnapshot.val() || {}) };
        })
      );

      return courses;
    } else {
      console.log('No enrolled courses found');
      return [];
    }
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    return [];
  }
};

// Fetch liked courses from Firebase
export const fetchLikedCourses = async (userId) => {
  const userLikesRef = ref(database, `users/${userId}/likedCourses`);
  return new Promise((resolve, reject) => {
    onValue(userLikesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const courseIds = Object.keys(data);
        const coursesRef = ref(database, 'courses');
        onValue(coursesRef, (snapshot) => {
          const allCourses = snapshot.val();
          if (allCourses) {
            resolve(courseIds.map(id => ({ id, ...allCourses[id] })));
          } else {
            resolve([]);
          }
        }, reject);
      } else {
        resolve([]);
      }
    }, reject);
  });
};
