import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchCourses, addReviewToCourse } from '../features/coursesSlice';
import { FaUser, FaUserTie } from 'react-icons/fa';
import { Calendar } from 'tabler-icons-react';
import { MdOutlineWatchLater } from 'react-icons/md';
import { AiFillLike } from 'react-icons/ai';

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
    return <p className="text-center mt-10 text-xl font-semibold">Loading...</p>;
  }

  return (
    <div className="p-4 w-full md:w-10/12 mx-auto pb-20">

      <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <img
              src={course.thumbnail}
              alt={course.name}
              className="w-full rounded-lg shadow-md mb-6 md:mb-0"
            />
          <div className="w-full">
            <span className="bg-green-50 text-green-500 text-sm font-semibold px-2 py-1 rounded-full mb-2 inline-block">
              Online
            </span>

            <h1 className="text-4xl font-bold mb-4">{course.name}</h1>
            <p className="text-gray-700 mb-6">{course.description}</p>
            <div className="w-full flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center text-lg font-bold  text-blue-500">
                <AiFillLike className="me-1" />
                <span className="">{course.likes}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center px-2 py-1 text-sm font-semibold">
                  <FaUserTie className="text-neutral-800 me-2" />
                  <p className="">{course.instructor}</p>
                </div>
                <div className="flex items-center px-2 py-1 text-sm font-semibold">
                  <Calendar className="text-neutral-800 me-2" />
                  <p className="">{course.duration}</p>
                </div>
              </div>
            </div>
            <p className="text-sm font-semibold bg-neutral-100 mb-3 p-2 rounded-lg">Schedule:  {course.schedule}</p>
            <p className="text-sm font-semibold bg-neutral-100 mb-3 p-2 rounded-lg">Prerequisites: {course.prerequisites.join(', ')}</p>
          </div>
        </div>

      </div>

      {/* Syllabus Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Syllabus</h2>
        {course.syllabus && course.syllabus.length > 0 ? (
          <ul className="list-disc pl-5 space-y-2">
            {course.syllabus.map((item, index) => (
              <li key={index} className="text-lg text-gray-700">
                <strong>Week {item.week}:</strong> {item.topic} - {item.content}
              </li>
            ))}
          </ul>
        ) : (
          <p>No syllabus available for this course.</p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>

        <div className="grid md:grid-cols-2 gap-3">
          <form onSubmit={handleReviewSubmit} className="mb-6">
            <div className="max-w-lg">
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm mb-4"
                placeholder="Write your review..."
                required
              />
            </div>
            {user ? (

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"

              >
                Submit Review
              </button>

            ) : (
              <Link to="/login" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
                Login to submit a review
              </Link>
            )}
          </form>

          <div className="block">
            {course.reviews && Object.keys(course.reviews).length > 0 ? (
              Object.values(course.reviews).map((review, index) => (
                <div key={index} className="max-w-lg mb-4 p-4 bg-gray-100 rounded-lg shadow-sm">
                  <div className="flex items-center text-sm font-semibold">
                    <p className="bg-red-100 flex justify-center items-center text-red-800 h-8 w-8 rounded-full me-2">
                      {review.studentName[0].toUpperCase()}
                    </p>
                    <p>
                      {review.studentName}
                    </p>
                  </div>
                  <div className="pl-10">
                    <p className="text-gray-700 mb-2">{review.text}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        </div>


      </div>
    </div >
  );
};

export default CourseDetails;
