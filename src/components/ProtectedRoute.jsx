import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { setUser, clearUser } from '../features/authSlice';
import { ImSpinner } from 'react-icons/im'; // Import spinner icon

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in
        dispatch(setUser(user));
      } else {
        // User is logged out
        dispatch(clearUser());
      }
      setLoading(false); // Set loading to false after checking auth state
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    // Show a loading spinner while the auth state is being checked
    return (
      <div className="flex justify-center items-center h-screen">
        <ImSpinner className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    );
  }

  return user ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
