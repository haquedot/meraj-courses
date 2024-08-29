import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CourseListing from './components/CourseListing';
import CourseDetails from './components/CourseDetails';
import StudentDashboard from './components/StudentDashboard';

const App = () => {
  return (
    <Router>
      <nav className="p-4 bg-blue-600 text-white">
        <Link to="/" className="mr-4">Courses</Link>
        <Link to="/dashboard">My Dashboard</Link>
      </nav>
      <Routes>

        <Route path="/" element={<CourseListing />} />
        <Route path="/course/:courseId" element={<CourseDetails />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
