import React, { useState } from 'react';
import axios from 'axios';

const Registration = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', { username, password });
      console.log(response.data); // Print newly registered user details
      // Optionally, redirect to login screen after successful registration
    } catch (error) {
      console.error('Registration failed:', error.response.data.message);
    }
  };

  return (
    <div>
      <h2>User Registration</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Registration;
