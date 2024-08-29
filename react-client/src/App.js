import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus } from './actions/authActions';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ProductList from './components/ProductList';
import CreateAccount from './components/CreateAccount';
import Login from './components/Login';
import ProductForm from './components/ProductForm';
import './App.css';  // Make sure to import the CSS file

const ProtectedProductList = ({ onEdit }) => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <ProductList onEdit={onEdit} />;
};

function App() {
  const [editingProduct, setEditingProduct] = useState(null);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const handleEdit = (product) => {
    console.log('Editing product:', product);
    setEditingProduct(product);
  };

  const handleSubmit = () => {
    console.log('Form submitted, resetting editingProduct');
    setEditingProduct(null);
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/products" 
            element={
              <>
                <ProtectedProductList onEdit={handleEdit} />
                {isAuthenticated && (
                  <ProductForm product={editingProduct} onSubmit={handleSubmit} />
                )}
              </>
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
