// src/components/CourseListing.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { enrollInCourse } from '../features/studentSlice';
import { ref, onValue, set, update, get } from 'firebase/database'; // Import get here
import { database } from '../firebase'; // Correctly import the database

const CourseListing = () => {
  const dispatch = useDispatch();
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const userId = 'userIdHere'; // Replace with actual userId or logic to fetch it

  // Get enrolled courses from Redux state
  const enrolledCourses = useSelector((state) => state.student.enrolledCourses);
  
  // Get liked courses from localStorage
  const [likedCourses, setLikedCourses] = useState(() => {
    return JSON.parse(localStorage.getItem('likedCourses')) || {};
  });

  useEffect(() => {
    // Fetch courses from Firebase
    const dbRef = ref(database, 'courses'); // Use the imported database
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);

      if (data) {
        setCourses(Object.values(data));
      } else {
        console.log('No courses found'); // Debugging line
      }
    });

    // Initialize enrolled courses from localStorage
    const storedCourses = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
    storedCourses.forEach((course) => {
      dispatch(enrollInCourse(course));
    });
  }, [dispatch]);

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
      
      // Update Firebase
      const dbRef = ref(database, `students/${userId}/enrolledCourses/${course.id}`);
      await set(dbRef, course);

      // Save to localStorage
      const storedCourses = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
      localStorage.setItem('enrolledCourses', JSON.stringify([...storedCourses, course]));
      
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
        const newLikes = courseData.likes + 1;
        await update(courseRef, { likes: newLikes });
        
        // Update local state
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.id === courseId ? { ...course, likes: newLikes } : course
          )
        );

        // Update likedCourses and localStorage
        const updatedLikedCourses = { ...likedCourses, [courseId]: true };
        setLikedCourses(updatedLikedCourses);
        localStorage.setItem('likedCourses', JSON.stringify(updatedLikedCourses));
      }
    } catch (error) {
      console.error("Error liking course:", error);
    }
  };

  return (
    <div className="p-4">
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
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                  disabled={likedCourses[course.id]}
                >
                  Like
                </button>
                <p className="ml-4">{course.likes} Likes</p>
              </div>
            </div>
          ))
        ) : (
          <p>No courses found.</p>
        )}
        </div>
      </div>
    </div>
  );
};

export default CourseListing;
