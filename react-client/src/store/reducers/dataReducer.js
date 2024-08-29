// src/reducers/dataReducer.js

const initialState = {
  products: [], // For products fetched from the API
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
      case 'SET_PRODUCTS':
          return {
              ...state,
              products: action.payload,
          };
      case 'ADD_ITEM':
          return {
              ...state,
              products: [...state.products, action.payload],
          };
      case 'EDIT_ITEM':
          console.log('EDIT_ITEM action received in reducer:', action.payload);
          return {
              ...state,
              products: state.products.map(item => {
                  console.log('Comparing item:', item);
                  console.log('With payload:', action.payload);
                  if (item && item.id && action.payload && action.payload.id &&
                      item.id.toString() === action.payload.id.toString()) {
                      console.log('Updating item in reducer:', item.id);
                      return action.payload;
                  }
                  return item;
              }),
          };
      case 'REMOVE_ITEM':
          return {
              ...state,
              products: state.products.filter(item => item.id !== action.payload.id),
          };
      default:
          return state;
  }
};

export default dataReducer;

/* 
if (item.is.toString() === action.payload.id.toString()) {
*/