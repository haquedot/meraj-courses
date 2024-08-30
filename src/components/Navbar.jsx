import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';

const Navbar = () => {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <nav className="p-4 bg-blue-600 text-white w-full flex justify-between">
            <div className="flex">
                <Link to="/" className="mr-4">Courses</Link>
            </div>
            <div className="flex">
                {user ? (
                    <>
                        <Link to="/dashboard" className="mr-4">My Dashboard</Link>
                        <button onClick={handleLogout} className="mr-4">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="mr-4">Login</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
