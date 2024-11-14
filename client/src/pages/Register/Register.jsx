import React, { useState } from 'react';
import './RegisterForm.css';

export default function RegisterForm({ onRegister }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(username,email, password);
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2 className="register-form-title">Rejestracja</h2>
      <input 
        type="text" 
        placeholder="Nazwa użykownika" 
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
