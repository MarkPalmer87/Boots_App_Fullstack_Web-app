const reviewReducer = (state = { reviews: {}, counts: {} }, action) => {
    console.log('Reducer: Current State:', JSON.stringify(state), 'Action:', JSON.stringify(action));
    switch (action.type) {
        case 'SET_REVIEWS':
            return {
                ...state,
                reviews: {
                    ...state.reviews,
                    [action.payload.bootId]: action.payload.reviews
                }
            };
        case 'ADD_REVIEW':
            return {
                ...state,
                reviews: {
                    ...state.reviews,
                    [action.payload.bootId]: [
                        action.payload,
                        ...(state.reviews[action.payload.bootId] || [])
                    ]
                },
                counts: {
                    ...state.counts,
                    [action.payload.bootId]: (state.counts[action.payload.bootId] || 0) + 1
                }
            };
        case 'SET_REVIEW_COUNTS':
            console.log('Reducer: Setting review counts:', JSON.stringify(action.payload));
            return {
                ...state,
                counts: action.payload
            };
        default:
            return state;
    }
};

export default reviewReducer;