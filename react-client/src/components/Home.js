import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logo from '../images/Boots.png'; // Adjust the filename as necessary

const Home = () => {
	const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

	if (isAuthenticated) {
		return <Navigate to="/products" replace />;
	}

	return (
		<div className="home landing">
			<h1>Welcome to the Boots App!</h1>
			<p>Please log in, or create an account to use the app.</p>
			<div className="cta-buttons">
				<Link to="/login" className="btn btn-primary">Log In</Link>
				<Link to="/create-account" className="btn btn-secondary">Create Account</Link>
			</div>
			<div className="logo-container">
				<img src={logo} alt="Boots App Logo" className="logo" />
			</div>
		</div>
	);
};

export default Home;
