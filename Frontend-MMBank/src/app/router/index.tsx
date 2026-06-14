import { createBrowserRouter } from 'react-router-dom';
import { PrivateRoute } from './privateRouter';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashBoardLayout';

// Páginas Importadas
import { Login } from '../../pages/auth/login';
import { Cadastro } from '../../pages/auth/Cadastro';
import { Dashboard } from '../../pages/dashboard/Dashboard';
import { Transferencias } from '../../pages/transferencias/Transferencias';
import { ChavesPix } from '../../pages/pix/ChavesPix';
import { Extrato } from '../../pages/extrato/Extrato';
import { Cartoes } from '../../pages/cartoes/Cartoes';
import { Cartao } from '../../pages/cartoes/Cartao';
import { SolicitarCartao } from '../../pages/cartoes/SolicitarCartao';
import { Emprestimos } from '../../pages/emprestimo/Emprestimos';
import { Home } from '../../pages/auth/Home';
import { EmConstrucao } from '../../pages/EmContrucao';
import { Configuracoes } from '../../pages/Perfil/Configuracoes';


export const router = createBrowserRouter([
  // --- ROTAS PÚBLICAS ---
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/cadastro',
    element: <Cadastro />
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/recuperar-senha', element: <EmConstrucao titulo="Recuperação de Senha" /> },
    ]
  },

  // --- ROTAS PRIVADAS (PF e Geral) ---
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/perfil', element: <Configuracoes /> },

          // Transferências e Extrato
          { path: '/transferencias', element: <Transferencias /> },
          { path: '/extrato', element: <Extrato /> },

          // Domínio Pix
          { path: '/pix', element: <ChavesPix /> },

          // Domínio Empréstimos
          { path: '/emprestimos', element: <Emprestimos /> },
          { path: '/emprestimos/novo', element: <EmConstrucao titulo="Simular Empréstimo" /> },

          // Domínio Cartões
          { path: '/cartoes', element: <Cartoes /> },
          { path: '/cartoes/novo', element: <SolicitarCartao /> },
          { path: '/cartoes/:id', element: <Cartao /> },

          // Emprestimos
          { path: '/agendamentos', element: <EmConstrucao titulo="Pagamentos e Agendamentos" /> },

          // --- ROTAS PRIVADAS (PJ) ---
          { path: '/pj/dashboard', element: <EmConstrucao titulo="Dashboard Empresarial" /> },
          { path: '/pj/notas-fiscais', element: <EmConstrucao titulo="Emissão de Notas Fiscais" /> },
        ]
      }
    ],
  },

  // --- Rota de Fallback (404) ---
  {
    path: '*',
    element: <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <h1 style={{ fontSize: '4rem', color: 'var(--accent-color)' }}>404</h1>
      <h2>Página não encontrada</h2>
      <a href="/dashboard" style={{ marginTop: '1rem', color: 'var(--text-main)' }}>Voltar ao Início</a>
    </div>,
  }
]);