import React, { useState } from 'react';
import './RegisterForm.css';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onRegister = async (username, email, password) => {
    try {
      const response = await fetch('http://localhost:3003/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      setSuccess('User registered successfully!');
      console.log('User registered:', data);
    } catch (error) {
      console.error('Error registering user:', error);
      setError(error.message);
      setSuccess(''); 
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); 
    setSuccess(''); 
    onRegister(username, email, password); 
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2 className="register-form-title">Rejestracja</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <input 
        type="text" 
        placeholder="Nazwa użytkownika" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        className="register-form-input"
      />
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        className="register-form-input"
      />
      <input 
        type="password" 
        placeholder="Hasło" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        className="register-form-input"
      />
      <button type="submit" className="register-form-button">Zarejestruj się</button>
    </form>
  );
}
