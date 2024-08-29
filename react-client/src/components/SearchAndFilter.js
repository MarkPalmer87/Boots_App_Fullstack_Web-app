import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProducts } from '../actions/dataActions';

const SearchAndFilter = ({ onSearch }) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const newSearchTerm = e.target.value;
    console.log('Search term updated:', newSearchTerm);
    setSearchTerm(newSearchTerm);
    onSearch(newSearchTerm);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      console.log('Dispatching fetchProducts with params:', params.toString());
      dispatch(fetchProducts(params.toString()));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, dispatch]);

  return (
    <div>
      <input 
        type="text" 
        value={searchTerm} 
        onChange={handleSearch} 
        placeholder="Search..." 
      />
    </div>
  );
};

export default SearchAndFilter;