import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addReview } from '../actions/reviewActions';

const AddReviewForm = ({ bootId, onClose }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting review:', { bootId, rating, comment });
        dispatch(addReview({ bootId, rating, comment }));
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="add-review-form">
            <h3>Add Review</h3>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                ))}
            </select>
            <textarea 
                value={comment} 
                onChange={(e) => setComment(e.target.value)} 
                placeholder="Write your review here"
                required
            />
            <button type="submit">Submit Review</button>
        </form>
    );
};

export default AddReviewForm;