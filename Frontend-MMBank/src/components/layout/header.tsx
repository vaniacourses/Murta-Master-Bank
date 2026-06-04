import React from 'react';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const { utilizador } = useAuth();
  
  const inicial = utilizador?.nome ? utilizador.nome.charAt(0).toUpperCase() : 'U';

  return (
    <header className="top-bar">
      <div>
        <h1>{title}</h1>
        {/* Futuramente, estes dados virão do ContaService */}
        <p className="account-info">Ag: 0001 | C/C: 123456-7</p>
      </div>
      <div className="user-profile">
        <div className="avatar">{inicial}</div>
      </div>
    </header>
  );
};