import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api.js';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { token } = await login(email, password);
      localStorage.setItem('token', token);
      navigate('/search');
    } catch (err) {
      setError(err.response?.data?.message || 'Falha no login');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', display: 'grid', gap: '0.5rem' }}>
      <label>
        Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label>
        Senha
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Entrar</button>
    </form>
  );
};

export default Login;
