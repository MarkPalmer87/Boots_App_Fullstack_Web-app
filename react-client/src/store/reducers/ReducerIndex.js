import { combineReducers } from 'redux';
import authReducer from './authReducer';
import dataReducer from './dataReducer';
import reviewReducer from './reviewReducer';

// Combine the reducers into a single rootReducer
const rootReducer = combineReducers({
  auth: authReducer,   // Handles authentication-related state
  data: dataReducer,   // Handles data-related state
  reviews: reviewReducer // Handles review-related state
});

export default rootReducer;
