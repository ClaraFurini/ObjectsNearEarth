import React, { useState } from 'react';
import { createNeo } from '../services/api.js';

const Insert = () => {
  const [form, setForm] = useState({
    name: '',
    date: '',
    distanceKm: '',
    isHazardous: false,
    material: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!form.name || !form.date || !form.material) {
      setMessage('Preencha todos os campos obrigatórios');
      return;
    }
    try {
      await createNeo({
        ...form,
        distanceKm: Number(form.distanceKm),
      });
      setMessage('NEO cadastrado com sucesso');
      setForm({ name: '', date: '', distanceKm: '', isHazardous: false, material: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erro ao salvar');
    }
  };

  return (
    <div className="panel">
      <div className="card">
        <h2 className="card-title">Inserir novo NEO</h2>
        <p className="helper">Registre um asteroide com dados essenciais para monitoramento.</p>
      </div>
      <form className="card form-grid" onSubmit={handleSubmit}>
        <label>
          Nome
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Data
          <input type="date" name="date" value={form.date} onChange={handleChange} required />
        </label>
        <label>
          Distância (km)
          <input type="number" name="distanceKm" value={form.distanceKm} onChange={handleChange} required />
        </label>
        <label>
          Material
          <input name="material" value={form.material} onChange={handleChange} required />
        </label>
        <label className="actions-row">
          <input type="checkbox" name="isHazardous" checked={form.isHazardous} onChange={handleChange} />
          <span>Perigoso?</span>
        </label>
        <button className="btn" type="submit">
          Salvar NEO
        </button>
        {message && <p className={`status ${message.includes('sucesso') ? 'success' : 'error'}`}>{message}</p>}
      </form>
    </div>
  );
};

export default Insert;
