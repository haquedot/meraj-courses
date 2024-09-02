import React, { useState, useEffect } from 'react';
import { AiFillLike } from 'react-icons/ai';
import { FaBookReader, FaUser } from 'react-icons/fa';
import { FaAnglesLeft, FaAnglesRight } from 'react-icons/fa6';
import { MdDashboard } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import { IoLogOut } from 'react-icons/io5';

const Sidebar = ({ activeSection, onSectionChange }) => {
  const [isOpen, setIsOpen] = useState(true); // State to manage sidebar visibility
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Initial check for mobile
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Update mobile state on resize
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSectionChange = (section) => {
    onSectionChange(section);
    if (isMobile) {
      setIsOpen(false); // Close sidebar if open and on mobile
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <div>
      {/* Toggle button for mobile */}
      <button
        onClick={toggleSidebar}
        className="fixed top-3 left-3 z-50 md:hidden p-1 text-sm bg-neutral-100 text-white rounded"
      >
        {isOpen ? (
          <FaAnglesLeft className='text-neutral-800' />
        ) : (
          <FaAnglesRight className='text-neutral-800' />
        )}
      </button>

      <div
        className={`w-50 fixed z-20 top-0 left-0 h-full bg-white text-neutral-800 border-r min-h-screen pt-16 p-3 md:p-3 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <ul className="space-y-4">
          <li>
            <button
              className={`rounded flex w-full text-left p-2 text-md items-center font-semibold ${activeSection === 'dashboard' ? 'bg-gray-100' : ''}`}
              onClick={() => handleSectionChange('dashboard')}
            >
              <MdDashboard className='' />
              <span className='ms-2'>Dashboard</span>
            </button>
          </li>
          <li>
            <button
              className={`rounded flex w-full text-left p-2 text-md items-center font-semibold ${activeSection === 'enrolledCourses' ? 'bg-gray-100' : ''}`}
              onClick={() => handleSectionChange('enrolledCourses')}
            >
              <FaBookReader className='' />
              <span className='ms-2'>Enrolled Courses</span>
            </button>
          </li>
          <li>
            <button
              className={`rounded flex w-full text-left p-2 text-md items-center font-semibold ${activeSection === 'completedCourses' ? 'bg-gray-100' : ''}`}
              onClick={() => handleSectionChange('completedCourses')}
            >
              <FaBookReader className='' />
              <span className='ms-2'>Completed Courses</span>
            </button>
          </li>
          <li>
            <button
              className={`rounded flex w-full text-left p-2 text-md items-center font-semibold ${activeSection === 'likedCourses' ? 'bg-gray-100' : ''}`}
              onClick={() => handleSectionChange('likedCourses')}
            >
              <AiFillLike className='' />
              <span className='ms-2'>Liked Courses</span>
            </button>
          </li>
          <li>
            <button
              className={`rounded flex w-full text-left p-2 text-md items-center font-semibold ${activeSection === 'profile' ? 'bg-gray-100' : ''}`}
              onClick={() => handleSectionChange('profile')}
            >
              <FaUser className='' />
              <span className='ms-2'>Profile</span>
            </button>
          </li>
          <li>
            <button
              className={`rounded flex w-full text-left p-2 text-md items-center font-semibold text-red-400`}
              onClick={handleLogout}
            >
              <IoLogOut className='' />
              <span className='ms-2'>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
