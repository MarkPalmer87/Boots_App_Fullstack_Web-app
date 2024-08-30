import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../actions/authActions';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const user = useSelector(state => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <nav>
            <ul>
                {isAuthenticated ? (
                    <>
                        <li><Link to="/">Home</Link></li>
                        <li>Welcome, {user ? user.username : 'User'}!</li>
                        <li><button className='logout' onClick={handleLogout}>Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/create-account">Create Account</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
