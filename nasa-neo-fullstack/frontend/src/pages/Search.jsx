import React, { useEffect, useState } from 'react';
import { fetchNeos } from '../services/api.js';

const Search = () => {
  const [filters, setFilters] = useState({ date: '', distanceMax: '', material: '', isHazardous: '' });
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setError('');
      const data = await fetchNeos(filters);
      setResults(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao buscar');
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.5rem', maxWidth: '500px' }}>
        <label>
          Data
          <input type="date" name="date" value={filters.date} onChange={handleChange} />
        </label>
        <label>
          Distância máxima (km)
          <input type="number" name="distanceMax" value={filters.distanceMax} onChange={handleChange} />
        </label>
        <label>
          Material
          <input type="text" name="material" value={filters.material} onChange={handleChange} />
        </label>
        <label>
          Periculosidade
          <select name="isHazardous" value={filters.isHazardous} onChange={handleChange}>
            <option value="">Todas</option>
            <option value="true">Perigoso</option>
            <option value="false">Não perigoso</option>
          </select>
        </label>
      </div>
      <button style={{ marginTop: '0.5rem' }} type="button" onClick={load}>
        Buscar
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {results.map((neo) => (
          <li key={neo._id}>
            <strong>{neo.name}</strong> - {new Date(neo.date).toLocaleDateString()} - {neo.distanceKm} km -
            {neo.isHazardous ? ' Perigoso' : ' Seguro'} - Material: {neo.material}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
