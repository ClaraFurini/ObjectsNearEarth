import React, { useEffect, useState } from 'react';
import { fetchNeos } from '../services/api.js';

const Search = () => {
  const [filters, setFilters] = useState({ date: '', isHazardous: '' });
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
    <div className="panel">
      <div className="card">
        <div className="filters-card">
          <label>
            Data
            <input type="date" name="date" value={filters.date} onChange={handleChange} />
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
        <button className="btn" type="button" onClick={load}>
          Buscar
        </button>
        {error && <p className="status error">{error}</p>}
      </div>
      <ul className="neo-list">
        {results.map((neo) => (
          <li key={neo._id} className="neo-card">
            <div className="actions-row">
              <strong>{neo.name}</strong>
              <span className={`badge ${neo.isHazardous ? 'danger' : 'safe'}`}>
                {neo.isHazardous ? 'Perigoso' : 'Seguro'}
              </span>
            </div>
            <div className="neo-meta">
              <span>{new Date(neo.date).toLocaleDateString()}</span>
              <span>{neo.distanceKm} km</span>
              <span>Material: {neo.material}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
