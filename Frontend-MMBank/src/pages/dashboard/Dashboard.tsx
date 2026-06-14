import React, { useState } from "react";
import { useDashboard } from "../../hooks/useDashboard"; 
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "./Dashboard.css";

// Mocks estáticos apenas para os meses anteriores no gráfico de linhas
const historicalData = [
  { name: "Jan", saldo: 12000 },
  { name: "Fev", saldo: 15000 },
  { name: "Mar", saldo: 14500 },
  { name: "Abr", saldo: 18000 },
  { name: "Mai", saldo: 21000 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#6366f1", "#ef4444"];

export const Dashboard: React.FC = () => {
  const [periodo, setPeriodo] = useState<"dia" | "mes" | "ano" | "custom">("ano");

  
  const { 
    conta, 
    transacoes, 
    totalEntradas, 
    totalSaidas, 
    paginaAtual, 
    totalPaginas, 
    setPaginaAtual, 
    loading,
    error,
    refetch
  } = useDashboard(1, 5); // Buscando de 5 em 5 para o extrato ficar paginado

  if (loading) return <div className="dashboard-loading">Buscando dados no MMBank...</div>;
  if (error || !conta) return <div className="dashboard-error">{error}</div>;

  const balanceData = [
    ...historicalData,
    { name: "Jun", saldo: conta.saldo }
  ];

  
  const categoriasAgrupadas = transacoes.reduce((acc: any, t) => {
    const ehSaida = t.tipo !== 'PIX_RECEBIDO' && t.tipo !== 'DEPOSITO' && !(t.tipo === 'TRANSFERENCIA' && t.valor > 0);
    if (ehSaida) {
      const catNome = t.categoria || "Outros";
      acc[catNome] = (acc[catNome] || 0) + Math.abs(t.valor);
    }
    return acc;
  }, {});

  const expensesData = Object.keys(categoriasAgrupadas).map(key => ({
    name: key,
    valor: categoriasAgrupadas[key]
  }));

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Visão Geral</h1>
          <p>
            Conta Corrente: <strong>{conta.numeroConta}</strong> | Status:{" "}
            {conta.statusConta}
          </p>
        </div>
      </header>

      {/* TOP CARDS: Valores reais do banco plugados */}
      <div className="dashboard-grid top-cards">
        <div className="dash-card balance-card">
          <div className="card-header">
            <h3>Saldo Disponível ({conta.tipoConta})</h3>
            <span className="icon-bg neutral">💰</span>
          </div>
          <h2>
            R$ {conta.saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </h2>
          // <p className="trend positive">↑ Sincronizado via API</p>
        </div>

        <div className="dash-card income-card">
          <div className="card-header">
            <h3>Entradas Realizadas</h3>
            <span className="icon-bg success">↓</span>
          </div>
          {/* LENDO VALOR REAL DO HOOK */}
          <h2 className="text-success">
            R$ {totalEntradas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </h2>
          <p className="trend text-muted">Total de receitas no banco</p>
        </div>

        <div className="dash-card expense-card">
          <div className="card-header">
            <h3>Saídas Realizadas</h3>
            <span className="icon-bg danger">↑</span>
          </div>
          {/* LENDO VALOR REAL DO HOOK */}
          <h2 className="text-danger">
            R$ {totalSaidas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </h2>
          <p className="trend text-muted">Total de despesas no banco</p>
        </div>
      </div>

      {/* MIDDLE SECTION - CHARTS */}
      <div className="dashboard-grid charts-grid">
        <div className="dash-card chart-card area-chart-card">
          <h3>Evolução do Saldo</h3>
          <div className="chart-wrapper area-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={balanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b" }} />
                <Tooltip cursor={{ stroke: "var(--accent-color)", strokeWidth: 1 }} />
                <Area type="monotone" dataKey="saldo" stroke="var(--accent-color)" strokeWidth={3} fillOpacity={1} fill="url(#colorSaldo)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dash-card chart-card donut-chart-card">
          <h3>Despesas por Categoria</h3>
          <div className="chart-wrapper donut-wrapper">
            {expensesData.length === 0 ? (
              <p className="text-muted" style={{ textAlign: "center", padding: "50px 0" }}>Nenhuma despesa registrada.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={expensesData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="valor">
                    {expensesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `R$ ${value}`} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION - TRANSAÇÕES RECENTES REAIS DO BANCO DE DADOS */}
      <div className="dash-card transactions-card">
        <div className="card-header border-bottom">
          <h3>Transações Recentes (Dados Reais)</h3>
          <button className="btn-link">Ver extrato completo</button>
        </div>
        <div className="transactions-list">
          {transacoes.length === 0 ? (
            <p className="text-muted" style={{ padding: "20px" }}>Nenhuma transação encontrada para esta conta.</p>
          ) : (
            // Exibe as 4 transações mais recentes da tabela do banco de dados
            transacoes.slice(0, 4).map((tx) => {
              const isIncome = tx.tipo === 'PIX_RECEBIDO' || tx.tipo === 'DEPOSITO' || (tx.tipo === 'TRANSFERENCIA' && tx.valor > 0);
              
              const traduzirTipo = (tipo: string) => {
                switch (tipo) {
                  case 'PIX_ENVIADO': return 'Pix Enviado';
                  case 'PIX_RECEBIDO': return 'Pix Recebido';
                  case 'DEPOSITO': return 'Depósito Efetuado';
                  case 'SAQUE': return 'Saque em Dinheiro';
                  case 'TRANSFERENCIA': return isIncome ? 'Transferência Recebida' : 'Transferência Enviada';
                  case 'PAGAMENTO_EMPRESTIMO': return 'Pagamento de Empréstimo';
                  case 'COMPRA_CREDITO': return 'Compra no Crédito';
                  case 'COMPRA_DEBITO': return 'Compra no Débito';
                  default: return tipo;
                }
              };

              return (
                <div key={tx.id} className="transaction-item">
                  <div className="tx-info">
                    <div className={`tx-icon ${isIncome ? "income" : "expense"}`}>
                      {isIncome ? "↓" : "↑"}
                    </div>
                    <div>
                      <h4>{traduzirTipo(tx.tipo)}</h4>
                      <span>{new Date(tx.data).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>
                  <div className={`tx-amount ${isIncome ? "income" : "expense"}`}>
                    {isIncome ? "+" : "-"} R$ {Math.abs(tx.valor).toFixed(2)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className="pagination-container" style={{ display: 'flex', justifyContent: 'spaceBetween', padding: '15px' }}>
        <button 
          className="btn-pagination"
          disabled={paginaAtual === 0} 
          onClick={() => setPaginaAtual(prev => prev - 1)}
        >
          ◀ Anterior
        </button>
        
        <span className="page-indicator">
          Página <strong>{paginaAtual + 1}</strong> de {totalPaginas}
        </span>
        
        <button 
          className="btn-pagination"
          disabled={paginaAtual >= totalPaginas - 1} 
          onClick={() => setPaginaAtual(prev => prev + 1)}
        >
          Próxima ▶
        </button>
      </div>
    </div>
  );
};