import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { fetchProducts, removeItem, editItem, addItem } from '../actions/dataActions';
import ProductForm from './ProductForm';
import { fetchReviewCounts } from '../actions/reviewActions';
import AddReviewForm from './AddReviewForm';
import SearchAndFilter from './SearchAndFilter';
import logo from '../images/Boots.png'; // Import the logo

const ProductList = () => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBoot, setSelectedBoot] = useState(null);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const products = useSelector(state => {
    console.log('Current products in Redux store:', state.data.products);
    return state.data.products;
  });
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
  }, [dispatch]);

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

  const handleAddReviewClick = (bootId) => {
    setSelectedBoot(bootId);
    setIsAddingReview(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <img src={logo} alt="Boots Logo" className="header-logo" />
        <div className="add-item-container">
          <ProductForm product={editingProduct} onSubmit={handleSubmit} />
        </div>
      </div>
      <SearchAndFilter />
      {console.log('SearchAndFilter component rendered')}
      {products.length === 0 ? (
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
            {products.map(product => (
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
