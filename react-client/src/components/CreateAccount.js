import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../actions/authActions';
import { useNavigate } from 'react-router-dom';

const CreateAccount = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error } = useSelector(state => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await dispatch(register(username, password));
        if (success) {
            navigate('/'); // Redirect to home page or dashboard
        }
    };

    return (
        <div>
            <h2>Create Account</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default CreateAccount;
