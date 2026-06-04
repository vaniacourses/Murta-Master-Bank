import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import './Dashboard.css';

// --- Mocks de Dados ---
const balanceData = [
  { name: 'Jan', saldo: 12000 }, { name: 'Fev', saldo: 15000 },
  { name: 'Mar', saldo: 14500 }, { name: 'Abr', saldo: 18000 },
  { name: 'Mai', saldo: 21000 }, { name: 'Jun', saldo: 24780 }
];

const expensesData = [
  { name: 'Alimentação', valor: 2500 },
  { name: 'Transporte', valor: 800 },
  { name: 'Lazer', valor: 1200 },
  { name: 'Moradia', valor: 3500 },
  { name: 'Saúde', valor: 600 }
];

// Cores para o Gráfico de Rosca
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ef4444'];

const recentTransactions = [
  { id: 1, date: '03 Jun 2026', desc: 'Pix Recebido - João Silva', amount: 1500.00, type: 'income' },
  { id: 2, date: '02 Jun 2026', desc: 'Uber *Trip', amount: 45.90, type: 'expense' },
  { id: 3, date: '01 Jun 2026', desc: 'Pagamento Fatura Cartão', amount: 2100.00, type: 'expense' },
  { id: 4, date: '28 Mai 2026', desc: 'Transferência TED - Salário', amount: 8500.00, type: 'income' },
];

export const Dashboard: React.FC = () => {
  const [periodo, setPeriodo] = useState<'dia' | 'mes' | 'ano' | 'custom'>('ano');

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Visão Geral</h1>
          <p>Bem-vindo de volta, Murta. Aqui está o resumo da sua movimentação.</p>
        </div>
      </header>

      {/* TOP CARDS: Saldo, Entradas e Saídas */}
      <div className="dashboard-grid top-cards">
        <div className="dash-card balance-card">
          <div className="card-header">
            <h3>Saldo Disponível</h3>
            <span className="icon-bg neutral">💰</span>
          </div>
          <h2>R$ 24.780,50</h2>
          <p className="trend positive">↑ 15% vs mês anterior</p>
        </div>

        <div className="dash-card income-card">
          <div className="card-header">
            <h3>Entradas (Junho)</h3>
            <span className="icon-bg success">↓</span>
          </div>
          <h2 className="text-success">R$ 12.500,00</h2>
          <p className="trend text-muted">Total de receitas no período</p>
        </div>

        <div className="dash-card expense-card">
          <div className="card-header">
            <h3>Saídas (Junho)</h3>
            <span className="icon-bg danger">↑</span>
          </div>
          <h2 className="text-danger">R$ 3.450,00</h2>
          <p className="trend text-muted">Total de despesas no período</p>
        </div>
      </div>

      {/* MIDDLE SECTION - CHARTS */}
      <div className="dashboard-grid charts-grid">
        
        {/* Gráfico Maior: Evolução do Saldo */}
        <div className="dash-card chart-card area-chart-card">
          <div className="chart-header-actions">
            <h3>Evolução do Saldo</h3>
            <div className="period-selector">
              <button className={periodo === 'dia' ? 'active' : ''} onClick={() => setPeriodo('dia')}>Dia</button>
              <button className={periodo === 'mes' ? 'active' : ''} onClick={() => setPeriodo('mes')}>Mês</button>
              <button className={periodo === 'ano' ? 'active' : ''} onClick={() => setPeriodo('ano')}>Ano</button>
              <button className={periodo === 'custom' ? 'active' : ''} onClick={() => setPeriodo('custom')}>Custom</button>
            </div>
          </div>
          <div className="chart-wrapper area-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={balanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip cursor={{stroke: 'var(--accent-color)', strokeWidth: 1}} />
                <Area type="monotone" dataKey="saldo" stroke="var(--accent-color)" strokeWidth={3} fillOpacity={1} fill="url(#colorSaldo)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Rosca: Categorias */}
        <div className="dash-card chart-card donut-chart-card">
          <h3>Despesas por Categoria</h3>
          <div className="chart-wrapper donut-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="valor"
                >
                  {expensesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${value}`} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION - TRANSACTIONS */}
      <div className="dash-card transactions-card">
        <div className="card-header border-bottom">
          <h3>Transações Recentes</h3>
          <button className="btn-link">Ver extrato completo</button>
        </div>
        <div className="transactions-list">
          {recentTransactions.map(tx => (
            <div key={tx.id} className="transaction-item">
              <div className="tx-info">
                <div className={`tx-icon ${tx.type}`}>
                  {tx.type === 'income' ? '↓' : '↑'}
                </div>
                <div>
                  <h4>{tx.desc}</h4>
                  <span>{tx.date}</span>
                </div>
              </div>
              <div className={`tx-amount ${tx.type}`}>
                {tx.type === 'income' ? '+' : '-'} R$ {tx.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};