import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReviews } from '../actions/reviewActions';

const ReviewList = ({ bootId }) => {
    const dispatch = useDispatch();
    const reviews = useSelector(state => state.reviews[bootId] || []);

    useEffect(() => {
        console.log('Fetching reviews for boot:', bootId);
        dispatch(fetchReviews(bootId));
    }, [dispatch, bootId]);

    console.log('Current reviews:', reviews);

    if (reviews.length === 0) {
        return <p>No reviews yet.</p>;
    }

    return (
        <div className="review-list">
            <h3>Reviews</h3>
            {reviews.map(review => (
                <div key={review.id} className="review-item">
                    <p>Rating: {review.rating}/5</p>
                    <p>{review.comment}</p>
                    <p>By {review.username} on {new Date(review.created_at).toLocaleDateString()}</p>
                </div>
            ))}
        </div>
    );
};

export default ReviewList;