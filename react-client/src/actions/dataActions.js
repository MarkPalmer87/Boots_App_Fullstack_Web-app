// src/actions/dataActions.js

// Helper function to get the token from localStorage
const getToken = () => localStorage.getItem('token');

// Action to fetch products from an API
export const fetchProducts = (searchParams = '') => async (dispatch) => {
    console.log('fetchProducts action called with params:', searchParams);
    try {
        const response = await fetch(`http://localhost:5000/products?${searchParams}`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        console.log('Data received from server:', JSON.stringify(data, null, 2));
        dispatch({ type: 'SET_PRODUCTS', payload: data });
        console.log('SET_PRODUCTS action dispatched');
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

// Action to add a new item
export const addItem = (item) => async (dispatch) => {
    console.log('addItem action called with:', item);
    try {
        const response = await fetch('http://localhost:5000/products', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(item)
        });
        if (!response.ok) {
            throw new Error('Failed to add item');
        }
        const newItem = await response.json();
        console.log('New item received from server:', newItem);
        dispatch({ type: 'ADD_ITEM', payload: newItem });
        console.log('ADD_ITEM action dispatched');
    } catch (error) {
        console.error('Error adding item:', error);
    }
};

// Action to edit an existing item
export const editItem = (item) => async (dispatch) => {
    console.log('editItem action called with:', item);
    try {
        const response = await fetch(`http://localhost:5000/products/${item.id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(item)
        });
        if (!response.ok) {
            throw new Error('Failed to edit item');
        }
        const updatedItem = await response.json();
        console.log('Updated item received from server:', updatedItem);
        dispatch({ type: 'EDIT_ITEM', payload: updatedItem });
        console.log('EDIT_ITEM action dispatched');
    } catch (error) {
        console.error('Error editing item:', error);
    }
};

// Action to remove an item
export const removeItem = (id) => async (dispatch) => {
    console.log('removeItem action called with id:', id);
    try {
        const response = await fetch(`http://localhost:5000/products/${id}`, { 
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to remove item');
        }
        dispatch({ type: 'REMOVE_ITEM', payload: { id } });
        console.log('REMOVE_ITEM action dispatched');
    } catch (error) {
        console.error('Error removing item:', error);
    }
};
