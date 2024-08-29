// src/components/StudentDashboard.jsx
import React, { useEffect, useState } from 'react';

const StudentDashboard = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    useEffect(() => {
        // Get enrolled courses from localStorage
        const storedCourses = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
        setEnrolledCourses(storedCourses);
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">My Enrolled Courses</h1>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                    {enrolledCourses.length > 0 ? (
                        enrolledCourses.map((course) => (
                            <div key={course.id} className="border p-4 rounded-lg shadow-md">
                                <h2 className="text-xl font-bold">{course.name}</h2>
                                <p>Instructor: {course.instructor}</p>
                                <p>{course.description}</p>
                                {/* Display other course details as needed */}
                            </div>
                        ))
                    ) : (
                        <p>No enrolled courses.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
