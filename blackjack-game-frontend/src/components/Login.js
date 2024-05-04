import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../contexts/DataContext';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUserData } = useContext(DataContext);

  const navigate = useNavigate(); 

  const handleLogin = async () => {
    try {
        console.log(username, password);
      const response = await axios.post('http://localhost:5000/api/users/login', { username, password });
      console.log(response.data); // Print user details after successful login
      setUserData(response.data);
      // Optionally, redirect to game selection screen after successful login
      navigate('/game-selection');
    } catch (error) {
      console.error('Login failed:', error.response.data.message);
    }
  };

  const handleSignup =  () => {
      navigate('/registration');
  };


  return (
    <div class="login-container">
      <h2>USER LOGIN</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="login-input"/>
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="login-input" />
      <button onClick={handleLogin} className="login-button">Login</button>
      <button onClick={handleSignup} className="Signup-button">Sign up</button>
    </div>
  );
};

export default Login;
