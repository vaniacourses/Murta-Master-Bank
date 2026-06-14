import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/header';

export const DashboardLayout: React.FC = () => {
  const location = useLocation();

  // Mapeamento simples de títulos baseado na rota atual
  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/dashboard': return 'Painel Geral';
      case '/transferencias': return 'Transferências';
      case '/emprestimos': return 'Empréstimos';
      case '/extrato': return 'Extrato de Conta';
      default: return 'MMBank';
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <Header title={getPageTitle(location.pathname)} />
        {/* O Outlet renderiza a página filha baseada na rota */}
        <Outlet />
      </main>
    </div>
  );
};