import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, removeItem, editItem, addItem } from '../actions/dataActions';
import ProductForm from './ProductForm';
import { Navigate } from 'react-router-dom';

const ProductList = () => {
  const [editingProduct, setEditingProduct] = useState(null);
  const products = useSelector(state => state.data.products);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(removeItem(id));
  };

  const handleEdit = (product) => {
    console.log('Edit button clicked for product:', product);
    setEditingProduct(product);
  };

  const handleSubmit = (formData) => {
    if (editingProduct) {
      dispatch(editItem({ ...formData, id: editingProduct.id }));
    } else {
      dispatch(addItem(formData));
    }
    setEditingProduct(null);
  };

  return (
    <div>
      <h2>Product List</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Brand</th>
            <th>Color</th>
            <th>Price</th>
            <th>Sizes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.brand}</td>
              <td>{product.color}</td>
              <td>${product.price}</td>
              <td>{product.sizes ? product.sizes.join(', ') : ''}</td>
              <td>
                <button className='edit' onClick={() => handleEdit(product)}>Edit</button>
                <button className='delete' onClick={() => handleDelete(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ProductForm product={editingProduct} onSubmit={handleSubmit} />
    </div>
  );
};

const ProtectedProductList = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <ProductList />;
};

export default ProtectedProductList;
