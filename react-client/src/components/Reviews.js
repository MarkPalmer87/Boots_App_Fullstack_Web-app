import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReviews } from '../actions/reviewActions';
import AddReviewForm from './AddReviewForm';

const Reviews = () => {
    const { bootId } = useParams();
    const dispatch = useDispatch();
    const reviews = useSelector(state => state.reviews.reviews[bootId] || []);
    const boot = useSelector(state => state.data.products.find(p => p.id === parseInt(bootId)));

    useEffect(() => {
        console.log('Fetching reviews for bootId:', bootId);
        dispatch(fetchReviews(bootId));
    }, [dispatch, bootId]);

    console.log('Current reviews:', reviews);
    console.log('Current boot:', boot);

    return (
        <div>
            <h2>Reviews for {boot ? boot.name : 'Boot'}</h2>
            <Link to="/products">Back to Products</Link>
            <div className="review-list">
                {reviews.length === 0 ? (
                    <p>No reviews yet.</p>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} className="review-item">
                            <h3>{review.username}'s Review</h3>
                            <p>{review.comment}</p>
                            <div className="review-meta">
                                <span>Rating: {review.rating}/5</span>
                                <span> | By: {review.username}</span>
                                <span> | Date: {new Date(review.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <AddReviewForm bootId={bootId} />
        </div>
    );
};

export default Reviews;