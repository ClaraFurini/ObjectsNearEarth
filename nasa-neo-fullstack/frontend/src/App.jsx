import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Search from './pages/Search.jsx';
import Insert from './pages/Insert.jsx';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const NavBar = () => (
  <nav style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
    <Link to="/search">Buscar NEOs</Link>
    <Link to="/insert">Inserir NEO</Link>
    <button
      type="button"
      onClick={() => {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }}
    >
      Sair
    </button>
  </nav>
);

const App = () => (
  <div style={{ padding: '1.5rem', fontFamily: 'Arial, sans-serif' }}>
    <h1>Objetos Próximos à Terra (NEOs)</h1>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/search"
        element={
          <PrivateRoute>
            <>
              <NavBar />
              <Search />
            </>
          </PrivateRoute>
        }
      />
      <Route
        path="/insert"
        element={
          <PrivateRoute>
            <>
              <NavBar />
              <Insert />
            </>
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  </div>
);

export default App;
