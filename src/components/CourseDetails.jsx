import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchCourses, addReviewToCourse } from '../features/coursesSlice';

const CourseDetails = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const course = useSelector((state) =>
    state.courses.list.find((c) => c.id === courseId)
  );
  const [reviewText, setReviewText] = useState('');
  const { user } = useSelector((state) => state.auth); // Get the current user from the auth slice

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (reviewText.trim()) {
      const review = {
        studentId: user.uid, // Using the user ID from the auth state
        studentName: user.displayName || 'Anonymous', // Ensure the student's name is defined
        text: reviewText,
        date: new Date().toISOString(),
      };
      dispatch(addReviewToCourse(courseId, review)); // Pass the entire review object
      setReviewText(''); // Clear the review input field
    }
  };

  if (!course) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col md:flex-row items-center md:items-start">
        <img
          src={course.thumbnail}
          alt={course.name}
          className="w-full md:w-1/3 rounded-lg mb-6 md:mb-0"
        />
        <div className="md:ml-6 w-full">
          <h1 className="text-3xl font-bold mb-4">{course.name}</h1>
          <p className="text-gray-700 mb-4">{course.description}</p>
          <p className="text-lg mb-2">
            <strong>Instructor:</strong> {course.instructor}
          </p>
          <p className="text-lg mb-2">
            <strong>Duration:</strong> {course.duration}
          </p>
          <p className="text-lg mb-2">
            <strong>Schedule:</strong> {course.schedule}
          </p>
          <p className="text-lg mb-2">
            <strong>Location:</strong> {course.location}
          </p>
          <p className="text-lg mb-4">
            <strong>Prerequisites:</strong> {course.prerequisites.join(', ')}
          </p>
          <div className="flex items-center">
            <span className="text-lg font-semibold mr-2">Likes:</span>
            <span className="text-xl font-bold text-red-600">{course.likes}</span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {course.reviews && course.reviews.length > 0 ? (
          course.reviews.map((review, index) => (
            <div key={index} className="mb-4">
              <p className="text-gray-800">
                <strong>{review.studentName}</strong>: {review.text}
              </p>
              <p className="text-sm text-gray-500">
              {new Date(review.date).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}

        {user ? (
          <form onSubmit={handleReviewSubmit} className="mt-6">
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Write your review..."
              required
            />
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit Review
            </button>
          </form>
        ) : (
          <p>Please log in to leave a review.</p>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
