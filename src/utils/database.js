import { ref, set, get } from 'firebase/database';
import { database } from '../firebase';

// Updated function to save completed courses
export const saveCompletedCourses = async (userId, completedCourses) => {
  try {
    // Save completed courses to the database
    await set(ref(database, `users/${userId}/completedCourses`), completedCourses);
  } catch (error) {
    console.error('Failed to save completed courses:', error);
    throw error;
  }
};


// Fetch completed courses for a user
export const fetchCompletedCourses = async (userId) => {
  try {
    const completedCoursesRef = ref(database, `users/${userId}/completedCourses`);
    const snapshot = await get(completedCoursesRef);

    if (snapshot.exists()) {
      const completedCoursesData = snapshot.val();
      const courseIds = Object.keys(completedCoursesData);

      // Fetch course details for each completed course
      const coursesRef = ref(database, 'courses');
      const allCoursesSnapshot = await get(coursesRef);

      if (allCoursesSnapshot.exists()) {
        const allCourses = allCoursesSnapshot.val();
        return courseIds.map(courseId => ({ id: courseId, ...allCourses[courseId] }));
      } else {
        console.log('No courses found');
        return [];
      }
    } else {
      console.log('No completed courses found');
      return [];
    }
  } catch (error) {
    console.error('Error fetching completed courses:', error);
    return [];
  }
};


// Fetch enrolled courses for a user
export const fetchEnrolledCourses = async (userId) => {
  try {
    const enrolledCoursesRef = ref(database, `users/${userId}/enrolledCourses`);
    const snapshot = await get(enrolledCoursesRef);

    if (snapshot.exists()) {
      const enrolledCoursesData = snapshot.val();
      const courseIds = Object.keys(enrolledCoursesData);

      // Fetch course details for each enrolled course
      const coursesRef = ref(database, 'courses');
      const allCoursesSnapshot = await get(coursesRef);

      if (allCoursesSnapshot.exists()) {
        const allCourses = allCoursesSnapshot.val();
        return courseIds.map(courseId => ({ id: courseId, ...allCourses[courseId] }));
      } else {
        console.log('No courses found');
        return [];
      }
    } else {
      console.log('No enrolled courses found');
      return [];
    }
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    return [];
  }
};

// Fetch liked courses for a user
export const fetchLikedCourses = async (userId) => {
  try {
    const userLikesRef = ref(database, `users/${userId}/likedCourses`);
    const snapshot = await get(userLikesRef);

    if (snapshot.exists()) {
      const likedCoursesData = snapshot.val();
      const courseIds = Object.keys(likedCoursesData);

      if (courseIds.length > 0) {
        const coursesRef = ref(database, 'courses');
        const allCoursesSnapshot = await get(coursesRef);

        if (allCoursesSnapshot.exists()) {
          const allCourses = allCoursesSnapshot.val();
          return courseIds.map(id => ({ id, ...allCourses[id] }));
        } else {
          console.log('No courses found');
          return [];
        }
      } else {
        return [];
      }
    } else {
      console.log('No liked courses found');
      return [];
    }
  } catch (error) {
    console.error('Error fetching liked courses:', error);
    return [];
  }
};
