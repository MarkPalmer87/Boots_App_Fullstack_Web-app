import axios from 'axios';

export const getToken = () => {
    return localStorage.getItem('token');
};

export const setToken = (token) => {
    localStorage.setItem('token', token);
    setAuthHeader(token);
};

export const removeToken = () => {
    localStorage.removeItem('token');
    setAuthHeader(null);
};

export const setAuthHeader = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};

// Add this function to initialize the auth header when the app loads
export const initializeAuth = () => {
    const token = getToken();
    if (token) {
        setAuthHeader(token);
    }
};