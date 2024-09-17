import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchEnrolledCourses, fetchLikedCourses, saveCompletedCourses } from '../utils/database';
import Sidebar from './Sidebar';
import { ImSpinner } from 'react-icons/im'; // Import spinner icon
import { Link } from 'react-router-dom';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { FaRegCalendarAlt, FaRegUser } from 'react-icons/fa';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';

const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [likedCourses, setLikedCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]); // New state for completed courses
  const [isLoading, setIsLoading] = useState(true); // State to manage loading
  const user = useSelector((state) => state.auth.user); // Fetch user data from Redux store

  useEffect(() => {
    if (user) {
      setIsLoading(true);

      fetchEnrolledCourses(user.uid)
        .then((courses) => {
          const completed = courses.filter(course => course.isCompleted);
          const enrolled = courses.filter(course => !course.isCompleted);

          setEnrolledCourses(enrolled);
          setCompletedCourses(completed);

          return fetchLikedCourses(user.uid);
        })
        .then((courses) => {
          setLikedCourses(courses);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user]);

  const handleMarkAsComplete = (courseId) => {
    const courseIndex = enrolledCourses.findIndex(course => course.id === courseId);
    if (courseIndex === -1) return;
  
    const updatedCourse = {
      ...enrolledCourses[courseIndex],
      isCompleted: true,
    };
  
    // Update the state
    setEnrolledCourses(prev => prev.filter(course => course.id !== courseId));
    setCompletedCourses(prev => {
      const newCompletedCourses = { ...prev.reduce((acc, course) => ({ ...acc, [course.id]: true }), {}) };
      newCompletedCourses[courseId] = true;
      return Object.keys(newCompletedCourses).map(id => ({ id, ...newCompletedCourses[id] }));
    });
  
    const completedCoursesMap = { ...completedCourses.reduce((acc, course) => ({ ...acc, [course.id]: true }), {}) };
    completedCoursesMap[courseId] = true;
  
    saveCompletedCourses(user.uid, completedCoursesMap)
      .catch(err => {
        console.error("Failed to update course completion:", err);
      });
  };
  

  const renderContent = () => {
    switch (activeSection) {
      case 'likedCourses':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {likedCourses.length > 0 ? (
              likedCourses.map((course) => (
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
                  <span className='absolute top-3 left-3 bg-green-50 text-xs font-semibold text-green-600 px-3 py-1 rounded-full'>Online</span>
                  <div className="p-4 pt-0">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <button
                          onClick={() => handleLike(course.id)}
                          disabled={likedCourses[course.id]}
                        >
                          <AiFillLike className="h-6 w-6 text-blue-500" />
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
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
                <p className="text-xl text-gray-600">No liked courses yet. Explore courses and like them to see them here!</p>
              </div>
            )}
          </div>
        );
      case 'enrolledCourses':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((course) => (
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
                      <p className="text-gray-600 mb-2">{course.description}</p>

                      <div className="flex items-center w-80 bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `50%` }}></div>
                        <p className="text-xs text-neutral-800 font-semibold">50%</p>
                      </div>

                      {/* Mark as Complete Button */}
                      <button
                        onClick={() => handleMarkAsComplete(course.id)}
                        className="mt-3 text-sm bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600"
                      >
                        Mark as Complete
                      </button>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
                <p className="text-xl text-gray-600">No enrolled courses yet. Explore courses and enroll to get started!</p>
              </div>
            )}
          </div>
        );

        case 'completedCourses':
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedCourses.length > 0 ? (
                completedCourses.map((course) => (
                  <div key={course.id} className="border rounded-3xl relative">
                    <Link to={`/course/${course.id}`} className="block mb-4">
                      <img
                        src="/public/images/react_native.png"
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
                        <p className="text-green-500 font-semibold mt-2">Completed</p>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
                  <p className="text-xl text-gray-600">No completed courses yet. Complete some courses to see them here!</p>
                </div>
              )}
            </div>
          );


      case 'profile':
        return (
          <div className="text-center">
            <div className="bg-white p-6 border rounded-lg shadow-xl max-w-md w-full">
              <div className="flex flex-col items-center">
                {/* Profile Picture */}
                <div className="mb-4">
                  <img
                    src="/public/images/user.jpg"
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-2 border-gray-300"
                  />
                </div>
                <h2 className="text-3xl font-semibold mb-4">{user?.displayName || 'Your Name'}</h2>
                <p className="text-lg mb-2 text-gray-700">
                  <strong>Email:</strong> {user?.email || 'your.email@example.com'}
                </p>
                <p className="text-lg mb-4 text-gray-700">
                  <strong>Number of Enrolled Courses:</strong> {enrolledCourses.length}
                </p>
              </div>
            </div>
          </div>
        );

      case 'dashboard':
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-2">Enrolled Courses</h2>
              <p className="text-gray-800">You are currently enrolled in {enrolledCourses.length} courses.</p>
            </div>
            <div className="bg-white border rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-2">Liked Courses</h2>
              <p className="text-gray-800">You have liked {likedCourses.length} courses.</p>
            </div>
            <div className="bg-white border rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-2">Completed Courses</h2>
              <p className="text-gray-800">You have completed {completedCourses.length} courses.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-auto pt-12 md:pt-0">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 p-3">
        <div className="container mx-auto md:pl-[120px]">
          <header className="mb-6">
            <Link to="/" className="text-blue-500 text-sm flex items-center hover:underline">
              <FaArrowLeftLong className="inline-block align-middle me-2" />
              Back to home
            </Link>
            <p className="mt-3 w-max text-xs text-green-500 font-semibold bg-green-50 px-3 py-1 rounded-full">{activeSection.replace(/([A-Z])/g, ' $1').toUpperCase()}</p>
            {/* back to home */}

          </header>
          {isLoading ? (
            <div className="flex justify-center items-center h-[520px]">
              <ImSpinner className="animate-spin h-12 w-12 text-blue-500" />
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
