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
    <div className="panel">
      <div className="card">
        <h2 className="card-title">Acessar painel</h2>
        <p className="helper">Use suas credenciais para entrar no painel espacial.</p>
      </div>
      <form className="card form-grid" onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Senha
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p className="status error">{error}</p>}
        <button className="btn" type="submit">
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
