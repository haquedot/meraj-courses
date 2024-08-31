import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { enrollInCourse } from '../features/studentSlice';
import { ref, onValue, set, get, update } from 'firebase/database';
import { auth, database } from '../firebase';
import { ImSpinner } from 'react-icons/im';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { FaRegCalendarAlt, FaRegUser } from 'react-icons/fa';
import { CiSearch } from 'react-icons/ci';

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
    <div className="p-4 md:w-10/12 mx-auto pb-20">
      {isLoading ? (
        <div className="flex justify-center items-center h-[90vh]">
          <ImSpinner className="animate-spin h-12 w-12 text-blue-500" />
        </div>
      ) : (
        <>
          <div className="relative mb-4 w-max">
            <input
              type="text"
              id="search"
              placeholder="Search"
              className="pl-4 pr-10 py-2 border rounded-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <label htmlFor="search" className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <CiSearch className="h-5 w-5 text-gray-400" />
            </label>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <div key={course.id} className="border rounded-3xl relative">
                    <Link to={`/course/${course.id}`} className="block mb-4">
                      <img
                        src={course.thumbnail}
                        alt={`${course.name} image`}
                        className="w-full h-48 object-cover border-b rounded-t-3xl mb-3"
                      />
                      <div className="px-4">
                        <div className="flex justify-between pb-3">
                          <p className='text-neutral-400 flex items-center'>
                            <FaRegUser className="inline-block text-sm text-neutral-400 me-2" />
                            <span className='text-sm'>{course.instructor}</span>
                          </p>
                          <p className='text-neutral-400 flex items-center'>
                            <FaRegCalendarAlt className="inline-block text-sm text-neutral-400 me-2" />
                            <span className='text-sm'>{course.duration}</span>
                          </p>
                        </div>
                        <h2 className="text-xl font-bold">{course.name}</h2>
                        <p className="text-gray-600">{course.description}</p>
                      </div>
                    </Link>
                    <span className='absolute top-3 left-3 bg-green-50 text-xs font-semibold text-green-600 px-3 py-1 rounded-full'>{course.location}</span>
                    <div className="p-4 pt-0">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <button
                            onClick={() => handleLike(course.id)}
                            disabled={likedCourses[course.id]}
                          >
                            {likedCourses[course.id] ? (
                              <AiFillLike className="h-6 w-6 text-blue-500" />
                            ) : (
                              <AiOutlineLike className="h-6 w-6 text-blue-500" />
                            )}
                          </button>
                          <span className="ml-1 text-sm text-neutral-600 font-semibold">{course.likes || 0}</span>
                        </div>
                        {enrolledCourses.find((c) => c.id === course.id) ? 
                        (
                          <span className="text-sm bg-green-50 px-4 py-1 rounded-full text-green-500 font-semibold">Enrolled</span>
                        ) : (
                          <button
                            onClick={() => handleEnroll(course)}
                            className={`text-neutral-500 text-sm font-semibold py-1 text-center px-4 border-2 border-neutral-500 rounded-full hover:bg-blue-600 hover:border-blue-600 hover:text-white ${enrolledCourses.find((c) => c.id === course.id) ? 'bg-gray-500 cursor-not-allowed' : ''}`}
                            disabled={enrolledCourses.find((c) => c.id === course.id)}
                          >Enroll

                          </button>
                        )}
                      </div>
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
