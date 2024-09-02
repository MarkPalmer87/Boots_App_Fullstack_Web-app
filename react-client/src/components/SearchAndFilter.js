import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProducts } from '../actions/dataActions';

const SearchAndFilter = () => {
  console.log('SearchAndFilter component rendering');
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    name: false,
    brand: false,
    color: false,
    price: false,
    sizes: false
  });
  const logRef = useRef([]);

  const addLog = (message) => {
    logRef.current = [...logRef.current, `${new Date().toISOString()}: ${message}`].slice(-10);
    console.log('Search and Filter Log:', logRef.current);
  };

  const handleSearch = (e) => {
    const newSearchTerm = e.target.value;
    console.log('Search term changed:', newSearchTerm);
    addLog(`Search term updated: ${newSearchTerm}`);
    setSearchTerm(newSearchTerm);
  };

  const handleFilterChange = useCallback((e) => {
    const { name, checked } = e.target;
    console.log('Filter changed:', name, checked);
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters, [name]: checked };
      addLog(`Filters updated: ${JSON.stringify(newFilters)}`);
      return newFilters;
    });
  }, []);

  useEffect(() => {
    console.log('Effect triggered. SearchTerm:', searchTerm, 'Filters:', filters);
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      Object.keys(filters).forEach(filter => {
        if (filters[filter]) {
          params.append(filter, 'true');
        }
      });
      const queryString = params.toString();
      console.log('Dispatching fetchProducts with params:', queryString);
      addLog(`Dispatching fetchProducts with params: ${queryString}`);
      dispatch(fetchProducts(queryString));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filters, dispatch]);

  return (
    <div>
      <input 
        type="text" 
        value={searchTerm} 
        onChange={handleSearch} 
        placeholder="Search..." 
      />
      <div>
        {Object.entries(filters).map(([key, value]) => (
          <label key={key}>
            <input
              type="checkbox"
              name={key}
              checked={value}
              onChange={handleFilterChange}
            />
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
        ))}
      </div>
    </div>
  );
};

export default SearchAndFilter;