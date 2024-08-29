// src/components/CourseDetails.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchCourses } from '../features/coursesSlice';

const CourseDetails = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const course = useSelector((state) =>
    state.courses.list.find((c) => c.id === courseId)
  );

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  if (!course) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{course.name}</h1>
      <p>{course.description}</p>
      <p>Instructor: {course.instructor}</p>
      <p>Duration: {course.duration}</p>
      <p>Schedule: {course.schedule}</p>
      <p>Location: {course.location}</p>
      <p>Prerequisites: {course.prerequisites.join(', ')}</p>
      <p>Likes: {course.likes}</p>
      <img src={course.thumbnail} alt={course.name} />
    </div>
  );
};

export default CourseDetails;
