import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReviews } from '../actions/reviewActions';


const ReviewList = ({ bootId }) => {
    const dispatch = useDispatch();
    const reviews = useSelector(state => state.reviews.reviews[bootId] || []);

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
            <h2>Reviews for Boot {bootId}</h2>
            {reviews.map(review => (
                <div key={review.id} className="review-item">
                    <h3>{review.username}'s Review</h3> {/*changed user_name to username*/}
                    <p>{review.content}</p>
                    <div className="review-meta">
                        <span>Rating: {review.rating}/5</span>
                        <span> | By: {review.username}</span>  {/*changed user_name to username*/}
                        <span> | Date: {new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReviewList;