import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { fetchProducts, removeItem, editItem, addItem } from '../actions/dataActions';
import ProductForm from './ProductForm';
import ReviewList from './ReviewList';
import { fetchReviewCounts } from '../actions/reviewActions';
import AddReviewForm from './AddReviewForm';
import SearchAndFilter from './SearchAndFilter';

const ProductList = () => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBoot, setSelectedBoot] = useState(null);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const products = useSelector(state => state.data.products);
  const dispatch = useDispatch();
  const reviewCounts = useSelector(state => state.reviews.counts);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      console.log('ProductList: Fetching products and review counts');
      try {
        await Promise.all([
          dispatch(fetchProducts()),
          dispatch(fetchReviewCounts())
        ]);
        console.log('ProductList: Data fetched successfully');
      } catch (error) {
        console.error('ProductList: Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dispatch]); // Remove reviewCounts from the dependency array

  useEffect(() => {
    console.log('ProductList: Current review counts:', reviewCounts);
    console.log('ProductList: Current products:', products);
  }, [reviewCounts, products]);

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

  const handleReviewClick = (bootId) => {
    setSelectedBoot(bootId);
    setIsAddingReview(false);
  };

  const handleAddReviewClick = (bootId) => {
    setSelectedBoot(bootId);
    setIsAddingReview(true);
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
                  {(reviewCounts[product.id] > 0) ? (
                    <Link to={`/reviews/${product.id}`}>
                      Reviews ({reviewCounts[product.id]})
                    </Link>
                  ) : (
                    <span>No reviews</span>
                  )}
                  <button onClick={() => handleAddReviewClick(product.id)}>Add Review</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {isAddingReview && (
        <div className="add-review-section">
          <AddReviewForm 
            bootId={selectedBoot} 
            onClose={() => setIsAddingReview(false)} 
          />
        </div>
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
