import React, { useState } from 'react';
import ProductList from './ProductList';
import ProductForm from './ProductForm';

const ProductListWrapper = ({ onEdit }) => {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddNew = () => {
    setShowAddForm(true);
  };

  const handleSubmit = () => {
    setShowAddForm(false);
  };

  return (
    <div>
      <h2>Products</h2>
      <button onClick={handleAddNew} className="btn btn-success mb-3">Add New Product</button>
      {showAddForm && <ProductForm onSubmit={handleSubmit} />}
      <ProductList onEdit={onEdit} />
    </div>
  );
};

export default ProductListWrapper;