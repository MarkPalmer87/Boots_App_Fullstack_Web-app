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
            {reviews.length === 0 ? (
                <p>No reviews yet.</p>
            ) : (
                <ul>
                    {reviews.map(review => (
                        <li key={review.id}>
                            <p>Rating: {review.rating}/5</p>
                            <p>{review.comment}</p>
                            <p>By {review.username} on {new Date(review.created_at).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            )}
            <AddReviewForm bootId={bootId} />
        </div>
    );
};

export default Reviews;