import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { signUp } from '../utils/auth';
import { setUser } from '../features/authSlice';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const user = await signUp(email, password, displayName);
      dispatch(setUser(user)); // Store user in Redux state
      navigate('/'); // Redirect to home page after successful sign-up
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-[90vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSignUp}>
          <h2 className="text-2xl text-center font-bold mb-4">Sign Up</h2>
          <p className="text-center mb-3">
            If you already have an account,{' '}
            <Link to="/login" className="text-blue-500">
              Login
            </Link>
          </p>
          <input
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="block w-full p-2 mb-4 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full p-2 mb-4 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full p-2 mb-4 border rounded"
          />
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Sign Up
          </button>
        </form>
      </div>

    </div>
  );
};

export default SignUp;
