import { getToken } from '../utils/auth';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const fetchReviews = (bootId) => async (dispatch) => {
    try {
        console.log('Fetching reviews for bootId:', bootId);
        const response = await fetch(`http://localhost:5000/api/reviews/${bootId}`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (!response.ok) throw new Error('Failed to fetch reviews');
        const data = await response.json();
        console.log('Fetched reviews:', data);
        dispatch({ type: 'SET_REVIEWS', payload: { bootId, reviews: data } });
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
};

export const addReview = (review) => async (dispatch) => {
    try {
        console.log('Adding review:', review);
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/reviews', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(review)
        });
        if (!response.ok) throw new Error('Failed to add review');
        const data = await response.json();
        console.log('Added review:', data);
        dispatch({ type: 'ADD_REVIEW', payload: data });
        
        // Refetch review counts after adding a new review
        dispatch(fetchReviewCounts());
    } catch (error) {
        console.error('Error adding review:', error);
    }
};

export const fetchReviewCounts = () => async (dispatch) => {
    try {
        console.log('Action: Fetching review counts');
        const token = localStorage.getItem('token');
        console.log('Token being used:', token ? 'Token exists' : 'No token found');
        
        const response = await axios.get(`${API_URL}/api/reviews/counts`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Action: Received review counts:', response.data);
        dispatch({ type: 'SET_REVIEW_COUNTS', payload: response.data });
    } catch (error) {
        console.error('Action: Error fetching review counts:', error.response ? error.response.data : error.message);
        console.error('Full error object:', error);
    }
};