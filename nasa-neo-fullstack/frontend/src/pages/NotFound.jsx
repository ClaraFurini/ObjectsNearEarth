import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <div className="panel">
      <div className="card not-found">
        <p className="eyebrow">erro 404</p>
        <h2 className="card-title">Página não encontrada</h2>
        <p className="helper">
          Não encontramos a rota solicitada. Você pode voltar para a página anterior ou sair e retornar
          à tela de login.
        </p>
        <div className="actions-row">
          <button className="btn ghost" type="button" onClick={() => navigate(-1)}>
            Voltar
          </button>
          <button className="btn" type="button" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
