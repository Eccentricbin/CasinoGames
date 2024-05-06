import React, { useState } from 'react';
import axios from 'axios';
import './Registration.css'
import { useNavigate } from 'react-router-dom';

const Registration = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', { username, password });
      alert("User " + response.data.username + " registered.")
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error.response.data.message);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="registration-page">
      <div className="Registration-container">
        <h2>User Registration</h2>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} class="input" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} class="input" />
        <button onClick={handleRegister} class="register">Register</button>
        <button onClick={handleLogin} class="login">Sign in</button>
      </div>
    </div>
  );
};

export default Registration;
