import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar: React.FC = () => {
  const { utilizador, logout } = useAuth();
  const primeiroNome = utilizador?.nome ? utilizador.nome.split(' ')[0] : 'Utilizador';

  return (
    <aside className="sidebar">
      <div className="logo-area">
        <h2>MM<span>Bank</span></h2>
        <p>Murta Master Bank</p>
      </div>
      
      <nav className="menu">
        {/* Usamos a tag 'end' no Início para não ficar ativo noutras rotas */}
        <NavLink to="/dashboard" end className={({ isActive }) => isActive ? "active" : ""}>
          🏠 Início
        </NavLink>
        <NavLink to="/extrato" className={({ isActive }) => isActive ? "active" : ""}>
          📊 Extrato
        </NavLink>
        <NavLink to="/transferencias" className={({ isActive }) => isActive ? "active" : ""}>
          💸 Transferências
        </NavLink>
        <NavLink to="/pix" className={({ isActive }) => isActive ? "active" : ""}>
          💠 Chaves Pix
        </NavLink>
        <NavLink to="/cartoes" className={({ isActive }) => isActive ? "active" : ""}>
          💳 Meus Cartões
        </NavLink>
        <NavLink to="/emprestimos" className={({ isActive }) => isActive ? "active" : ""}>
          🏦 Empréstimos
        </NavLink>
        {utilizador?.tipo === 'PJ' && (
          <NavLink to="/pj/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
            🏢 Área PJ (Empresa)
          </NavLink>
        )}
      </nav>
      
      <div className="sidebar-footer" style={{ flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
        <NavLink to="/perfil" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>
          ⚙️ Meu Perfil
        </NavLink>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginTop: '10px' }}>
          <p>Olá, {primeiroNome}</p>
          <button className="btn-logout" onClick={logout}>Sair</button>
        </div>
      </div>
    </aside>
  );
};