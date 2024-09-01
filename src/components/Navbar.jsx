import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import { IoLogOut } from 'react-icons/io5';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <nav className="text-neutral-800 text-md font-semibold border-b w-full">
            <div className="w-10/12 flex justify-between py-4 md:px-4 mx-auto">
                <div className="flex">
                    <Link to="/" className="mr-4">Meraj Courses</Link>
                </div>
                <div className="flex gap-3">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="">
                                <FaUserCircle className='inline-block text-blue-500 h-6 w-6' />
                            </Link>
                            <button onClick={handleLogout} className="">
                                <IoLogOut className='inline-block text-red-500 h-6 w-6' />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="">Login</Link>
                        </>
                    )}
                </div></div>
        </nav>
    );
};

export default Navbar;
