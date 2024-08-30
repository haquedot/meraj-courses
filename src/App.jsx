import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CourseListing from './components/CourseListing';
import CourseDetails from './components/CourseDetails';
import StudentDashboard from './components/StudentDashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import Logout from './components/Logout';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { setUser } from './features/authSlice';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation(); // Get the current location
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user));
      } else {
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <>
      {/* Conditionally render Navbar based on the current route */}
      {location.pathname !== '/dashboard' && <Navbar />}
      <Routes>
        <Route path="/" element={<CourseListing />} />
        <Route path="/course/:courseId" element={<CourseDetails />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={StudentDashboard} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </>
  );
};

// Wrap App with Router
const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
