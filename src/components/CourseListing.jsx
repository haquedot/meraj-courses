import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { enrollInCourse } from '../features/studentSlice';
import { ref, onValue, set, get, update } from 'firebase/database';
import { auth, database } from '../firebase';
import { ImSpinner } from 'react-icons/im';

const CourseListing = () => {
  const dispatch = useDispatch();
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Get enrolled courses from Redux state
  const enrolledCourses = useSelector((state) => state.student.enrolledCourses);

  // Get liked courses from Redux state
  const [likedCourses, setLikedCourses] = useState({});

  useEffect(() => {
    // Fetch the current user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid); // Set the user ID when logged in

        // Fetch enrolled courses for the logged-in user from Firebase
        const userCoursesRef = ref(database, `users/${user.uid}/enrolledCourses`);
        onValue(userCoursesRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            // Convert enrolledCourses object to array format for Redux state
            const enrolledCoursesArray = Object.keys(data).map(courseId => ({ id: courseId }));
            enrolledCoursesArray.forEach(course => dispatch(enrollInCourse(course)));
          }
        });

        // Fetch liked courses for the logged-in user from Firebase
        const userLikesRef = ref(database, `users/${user.uid}/likedCourses`);
        onValue(userLikesRef, (snapshot) => {
          const data = snapshot.val() || {};
          setLikedCourses(data);
        });
      } else {
        setUserId(null); // Reset user ID if logged out
      }
    });

    return () => unsubscribe(); // Clean up the subscription on unmount
  }, [dispatch]);

  useEffect(() => {
    // Fetch courses from Firebase
    const dbRef = ref(database, 'courses');
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCourses(Object.entries(data).map(([id, course]) => ({ id, ...course })));
      } else {
        console.log('No courses found');
      }
      setIsLoading(false); // Set loading to false after data is loaded
    });
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(search.toLowerCase()) ||
    course.instructor.toLowerCase().includes(search.toLowerCase())
  );

  const handleEnroll = async (course) => {
    try {
      // Check if already enrolled
      if (enrolledCourses.find((c) => c.id === course.id)) {
        alert("You are already enrolled in this course.");
        return;
      }

      // Update Redux state
      dispatch(enrollInCourse(course));

      // Update Firebase with the logged-in user's ID
      const dbRef = ref(database, `users/${userId}/enrolledCourses/${course.id}`);
      await set(dbRef, true);

    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };

  const handleLike = async (courseId) => {
    try {
      if (likedCourses[courseId]) {
        alert("You have already liked this course.");
        return;
      }

      const courseRef = ref(database, `courses/${courseId}`);
      const courseSnapshot = await get(courseRef);
      const courseData = courseSnapshot.val();

      if (courseData) {
        const newLikes = (courseData.likes || 0) + 1;
        await update(courseRef, { likes: newLikes });

        // Update Firebase with the liked course
        const userLikesRef = ref(database, `users/${userId}/likedCourses/${courseId}`);
        await set(userLikesRef, true);

        // Update local state
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.id === courseId ? { ...course, likes: newLikes } : course
          )
        );

        // Update likedCourses in local state
        setLikedCourses((prevLikedCourses) => ({ ...prevLikedCourses, [courseId]: true }));
      }
    } catch (error) {
      console.error("Error liking course:", error);
    }
  };

  return (
    <div className="p-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <ImSpinner className="animate-spin h-12 w-12 text-blue-500" />
        </div>
      ) : (
        <>
          <input
            type="text"
            placeholder="Search by course name or instructor"
            className="mb-4 p-2 border rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <div key={course.id} className="border p-4 rounded-lg shadow-md">
                    <Link to={`/course/${course.id}`} className="block mb-4">
                      <h2 className="text-xl font-bold">{course.name}</h2>
                      <p>Instructor: {course.instructor}</p>
                    </Link>
                    <button
                      onClick={() => handleEnroll(course)}
                      className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${enrolledCourses.find((c) => c.id === course.id) ? 'bg-gray-500 cursor-not-allowed' : ''}`}
                      disabled={enrolledCourses.find((c) => c.id === course.id)}
                    >
                      {enrolledCourses.find((c) => c.id === course.id) ? 'Enrolled' : 'Enroll'}
                    </button>
                    <div className="mt-4 flex items-center">
                      <button
                        onClick={() => handleLike(course.id)}
                        className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                        disabled={likedCourses[course.id]}
                      >
                        {
                          likedCourses[course.id] ?
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-thumb-up"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M13 3a3 3 0 0 1 2.995 2.824l.005 .176v4h2a3 3 0 0 1 2.98 2.65l.015 .174l.005 .176l-.02 .196l-1.006 5.032c-.381 1.626 -1.502 2.796 -2.81 2.78l-.164 -.008h-8a1 1 0 0 1 -.993 -.883l-.007 -.117l.001 -9.536a1 1 0 0 1 .5 -.865a2.998 2.998 0 0 0 1.492 -2.397l.007 -.202v-1a3 3 0 0 1 3 -3z" /><path d="M5 10a1 1 0 0 1 .993 .883l.007 .117v9a1 1 0 0 1 -.883 .993l-.117 .007h-1a2 2 0 0 1 -1.995 -1.85l-.005 -.15v-7a2 2 0 0 1 1.85 -1.995l.15 -.005h1z" /></svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-thumb-up"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 11v9a1 1 0 0 0 1 1h8a4 4 0 0 0 4 -4v-5a3 3 0 0 0 -3 -3h-2l1 -4a2 2 0 1 0 -4 0v10" /><path d="M7 11h-3a1 1 0 0 0 -1 1v6a1 1 0 0 0 1 1h3" /></svg>
                        }
                      </button>
                      <span className="ml-2">{course.likes || 0}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No courses found.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CourseListing;
