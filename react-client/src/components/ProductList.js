import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, removeItem, editItem, addItem } from '../actions/dataActions';
import ProductForm from './ProductForm';
import { Navigate } from 'react-router-dom';
import SearchAndFilter from './SearchAndFilter';

const ProductList = () => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const products = useSelector(state => state.data.products);
  console.log('Products in ProductList:', products);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await dispatch(fetchProducts());
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch]);

  console.log('Current products in ProductList:', JSON.stringify(products, null, 2));

  const handleDelete = (id) => {
    dispatch(removeItem(id));
  };

  const handleEdit = (product) => {
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

  const handleSearch = (term) => {
    setSearchTerm(term);
    dispatch(fetchProducts(`search=${term}`));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.color.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Product List</h2>
      <SearchAndFilter onSearch={handleSearch} />
      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
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
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.brand}</td>
                <td>{product.color}</td>
                <td>${product.price}</td>
                <td>{Array.isArray(product.sizes) ? product.sizes.join(', ') : (product.sizes || '')}</td>
                <td>
                  <button className='edit' onClick={() => handleEdit(product)}>Edit</button>
                  <button className='delete' onClick={() => handleDelete(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
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
