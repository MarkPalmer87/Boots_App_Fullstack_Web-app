// src/index.js
// this is the entry point for Rclient/ReactDOM';ich renders the app component into the DOM

import React from 'react';
import ReactDOM from 'react-dom/client'; // Update to import from 'react-dom/client'
import { Provider } from 'react-redux';
import App from './App';
import store from './store/StoreIndex.js';  // Import your Redux store
// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);