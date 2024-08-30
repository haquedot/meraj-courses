import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchEnrolledCourses, fetchLikedCourses } from '../utils/database';
import Sidebar from './Sidebar';
import { ImSpinner } from 'react-icons/im'; // Import spinner icon
import { Link } from 'react-router-dom';
import { FaArrowLeftLong } from 'react-icons/fa6';

const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [likedCourses, setLikedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State to manage loading
  const user = useSelector((state) => state.auth.user); // Fetch user data from Redux store

  useEffect(() => {
    if (user) {
      // Start loading
      setIsLoading(true);

      // Fetch enrolled courses for the logged-in user
      fetchEnrolledCourses(user.uid).then((courses) => {
        setEnrolledCourses(courses || []);

        // Fetch liked courses for the logged-in user
        return fetchLikedCourses(user.uid);
      }).then((courses) => {
        setLikedCourses(courses || []);

        // Stop loading
        setIsLoading(false);
      });
    }
  }, [user]);

  const renderContent = () => {
    switch (activeSection) {
      case 'likedCourses':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {likedCourses.length > 0 ? (
              likedCourses.map((course) => (
                <div key={course.id} className="bg-white border rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-2">{course.name}</h2>
                  <p className="text-gray-600 mb-2"><strong>Instructor:</strong> {course.instructor}</p>
                  <p className="text-gray-800">{course.description}</p>
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
                <div key={course.id} className="bg-white border rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-2">{course.name}</h2>
                  <p className="text-gray-600 mb-2"><strong>Instructor:</strong> {course.instructor}</p>
                  <p className="text-gray-800">{course.description}</p>
                </div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
                <p className="text-xl text-gray-600">No enrolled courses yet. Explore courses and enroll to get started!</p>
              </div>
            )}
          </div>
        );
      case 'profile':
        return (
          <div className="text-center py-12">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <div className="flex flex-col items-center">
                {/* Profile Picture */}
                <div className="mb-4">
                  <img
                    src={user?.photoURL || 'https://via.placeholder.com/150'}
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
              <h2 className="text-xl font-semibold mb-2">Profile</h2>
              <p className="text-gray-800">View and update your profile information.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-auto pt-12 md:pt-0">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 p-3">
        <div className="container mx-auto md:pl-[100px]">
          <header className="mb-6">
            <Link to="/" className="text-blue-500 hover:underline">
              <FaArrowLeftLong className="inline-block align-middle me-2" />
              Back to home
            </Link>
            <p className="mt-3 w-max text-xs text-neutral-600 font-semibold bg-neutral-200 px-2 py-1 rounded">{activeSection.replace(/([A-Z])/g, ' $1').toUpperCase()}</p>
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
