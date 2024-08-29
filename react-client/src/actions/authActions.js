export const login = (username, password) => async (dispatch) => {
    try {
        // Make an API call to your backend
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (response.ok) {
            // If login is successful, dispatch LOGIN_SUCCESS
            dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
            // Store the token in localStorage
            localStorage.setItem('token', data.token);
        } else {
            // If login fails, dispatch LOGIN_FAILURE
            dispatch({ type: 'LOGIN_FAILURE', payload: data.message });
        }
    } catch (error) {
        console.error('Login error:', error);
        dispatch({ type: 'LOGIN_FAILURE', payload: 'An error occurred during login' });
    }
};

export const register = (username, password) => async (dispatch) => {
    try {
        // Make an API call to your backend
        const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (response.ok) {
            // If registration is successful, dispatch REGISTER_SUCCESS
            dispatch({ type: 'REGISTER_SUCCESS', payload: data.user });
            // Store the token in localStorage
            localStorage.setItem('token', data.token);
        } else {
            // If registration fails, dispatch REGISTER_FAILURE
            dispatch({ type: 'REGISTER_FAILURE', payload: data.message });
        }
    } catch (error) {
        console.error('Registration error:', error);
        dispatch({ type: 'REGISTER_FAILURE', payload: 'An error occurred during registration' });
    }
};

export const logout = () => (dispatch) => {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    // Dispatch LOGOUT action
    dispatch({ type: 'LOGOUT' });
};

// New action to check if the user is already logged in
export const checkAuthStatus = () => async (dispatch) => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            // Verify the token with your backend
            const response = await fetch('http://localhost:5000/verify-token', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            const data = await response.json();

            if (response.ok) {
                dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
            } else {
                // If token is invalid, remove it and log out
                localStorage.removeItem('token');
                dispatch({ type: 'LOGOUT' });
            }
        } catch (error) {
            console.error('Token verification error:', error);
            localStorage.removeItem('token');
            dispatch({ type: 'LOGOUT' });
        }
    }
};
