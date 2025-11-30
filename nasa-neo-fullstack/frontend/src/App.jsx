import React from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Search from './pages/Search.jsx';
import Insert from './pages/Insert.jsx';
import NotFound from './pages/NotFound.jsx';
import './styles.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <nav className="nav-bar">
      <div className="brand">
        <span className="brand-dot" />
        <span>NEO Watch</span>
      </div>
      <div className="nav-actions">
        <Link className="nav-link" to="/search">
          Buscar NEOs
        </Link>
        <Link className="nav-link" to="/insert">
          Inserir NEO
        </Link>
        <button className="btn ghost" type="button" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </nav>
  );
};

const App = () => (
  <div className="app-shell">
    <div className="glow-orb" />
    <div className="app-content">
      <header className="app-header">
        <p className="eyebrow">monitoramento espacial</p>
        <h1 className="app-title">Objetos Próximos à Terra (NEOs)</h1>
        <p className="subtitle">
          Explore, cadastre e monitore asteroides com um painel inspirado no cosmos.
          Visual limpo, tons nebulosos e um toque futurista para acompanhar a segurança do nosso planeta.
        </p>
      </header>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
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
        <Route
          path="*"
          element={
            <PrivateRoute>
              <>
                <NavBar />
                <NotFound />
              </>
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  </div>
);

export default App;
