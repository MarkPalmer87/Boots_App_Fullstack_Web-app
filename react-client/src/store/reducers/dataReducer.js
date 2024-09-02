// src/store/reducers/dataReducer.js

const initialState = {
  products: [],
  error: null,
  loading: false,
  reviews: {},
  counts: {}
};

const dataReducer = (state = initialState, action) => {
  console.log('Data Reducer received action:', action.type, action.payload);
  switch (action.type) {
    case 'FETCH_PRODUCTS_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_PRODUCTS_SUCCESS':
      console.log('Updating products in state:', action.payload);
      return {
        ...state,
        products: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_PRODUCTS_FAILURE':
      return {
        ...state,
        products: [],
        loading: false,
        error: action.payload
      };
    case 'ADD_ITEM':
      return {
        ...state,
        products: [...state.products, action.payload],
        error: null
      };
    case 'ADD_ITEM_FAILURE':
      return {
        ...state,
        error: action.payload
      };
    case 'EDIT_ITEM':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        ),
        error: null
      };
    case 'EDIT_ITEM_FAILURE':
      return {
        ...state,
        error: action.payload
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload.id),
        error: null
      };
    case 'REMOVE_ITEM_FAILURE':
      return {
        ...state,
        error: action.payload
      };
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload,
        error: null
      };
    case 'ADD_REVIEW':
      return {
        ...state,
        reviews: {
          ...state.reviews,
          [action.payload.productId]: [
            ...(state.reviews[action.payload.productId] || []),
            action.payload.review
          ]
        }
      };
    case 'SET_REVIEW_COUNTS':
      return {
        ...state,
        counts: action.payload
      };
    default:
      return state;
  }
};

export default dataReducer;

/* 
if (item.is.toString() === action.payload.id.toString()) {
*/