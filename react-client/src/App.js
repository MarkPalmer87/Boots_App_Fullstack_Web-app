import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus } from './actions/authActions';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ProductList from './components/ProductList';
import Reviews from './components/Reviews';
import CreateAccount from './components/CreateAccount';
import Login from './components/Login';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/products" 
            element={
              <ProtectedRoute>
                <ProductList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reviews/:bootId" 
            element={
              <ProtectedRoute>
                <Reviews />
              </ProtectedRoute>
            } 
          />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
