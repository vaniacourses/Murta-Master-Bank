import React, { useState, useMemo } from 'react';
import './Extrato.css';

// Tipagens baseadas no Diagrama de Entidade
type TipoTransacao = 'PIX_ENVIADO' | 'PIX_RECEBIDO' | 'DEPOSITO' | 'SAQUE' | 'TRANSFERENCIA' | 'PAGAMENTO_EMPRESTIMO';
type StatusTransacao = 'PENDENTE' | 'CONCLUIDA' | 'FALHA';

interface Transacao {
  id: number;
  tipo: TipoTransacao;
  valor: number;
  data: string;
  status: StatusTransacao;
  categoria: string;
}

// Mock de dados simulando o retorno do back-end
const transacoesMock: Transacao[] = [
  { id: 1, tipo: 'PIX_ENVIADO', valor: -150.00, data: '2026-05-25', status: 'CONCLUIDA', categoria: 'Mercado' },
  { id: 2, tipo: 'PIX_RECEBIDO', valor: 4500.00, data: '2026-05-24', status: 'CONCLUIDA', categoria: 'Salário' },
  { id: 3, tipo: 'TRANSFERENCIA', valor: -800.00, data: '2026-05-23', status: 'PENDENTE', categoria: 'Pagamento Fatura' },
  { id: 4, tipo: 'SAQUE', valor: -200.00, data: '2026-05-20', status: 'CONCLUIDA', categoria: 'Caixa Eletrônico 24h' },
  { id: 5, tipo: 'PAGAMENTO_EMPRESTIMO', valor: -350.50, data: '2026-05-15', status: 'FALHA', categoria: 'Parcela 02/12' },
  { id: 6, tipo: 'DEPOSITO', valor: 1200.00, data: '2026-05-10', status: 'CONCLUIDA', categoria: 'Depósito em Dinheiro' },
];

export const Extrato: React.FC = () => {
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('TODOS');
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');

  // Lógica de filtragem usando useMemo para performance
  const transacoesFiltradas = useMemo(() => {
    return transacoesMock.filter(tx => {
      const matchBusca = tx.categoria.toLowerCase().includes(busca.toLowerCase()) || 
                         tx.tipo.replace('_', ' ').toLowerCase().includes(busca.toLowerCase());
      const matchTipo = filtroTipo === 'TODOS' || tx.tipo === filtroTipo;
      const matchStatus = filtroStatus === 'TODOS' || tx.status === filtroStatus;

      return matchBusca && matchTipo && matchStatus;
    });
  }, [busca, filtroTipo, filtroStatus]);

  // Função para formatar o nome do tipo de transação
  const formatarTipo = (tipo: string) => {
    return tipo.replace('_', ' ').replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
  };

  return (
    <div className="extrato-container">
      <header className="extrato-header">
        <div>
          <h1>Extrato da Conta</h1>
          <p>Acompanhe suas movimentações financeiras detalhadas.</p>
        </div>
        <button className="btn-export">Exportar PDF</button>
      </header>

      {/* Barra de Filtros */}
      <div className="filters-card">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Buscar por descrição..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        
        <div className="filter-selectors">
          <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
            <option value="TODOS">Todos os Tipos</option>
            <option value="PIX_ENVIADO">Pix Enviado</option>
            <option value="PIX_RECEBIDO">Pix Recebido</option>
            <option value="TRANSFERENCIA">Transferência</option>
            <option value="DEPOSITO">Depósito</option>
            <option value="SAQUE">Saque</option>
            <option value="PAGAMENTO_EMPRESTIMO">Pag. Empréstimo</option>
          </select>

          <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
            <option value="TODOS">Todos os Status</option>
            <option value="CONCLUIDA">Concluída</option>
            <option value="PENDENTE">Pendente</option>
            <option value="FALHA">Falha</option>
          </select>
        </div>
      </div>

      {/* Tabela de Transações */}
      <div className="transactions-card">
        <div className="table-responsive">
          <table className="extrato-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Tipo / Descrição</th>
                <th>Status</th>
                <th className="align-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              {transacoesFiltradas.length > 0 ? (
                transacoesFiltradas.map((tx) => (
                  <tr key={tx.id}>
                    <td className="tx-date">
                      {new Date(tx.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="tx-info">
                      <strong>{tx.categoria}</strong>
                      <span>{formatarTipo(tx.tipo)}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${tx.status.toLowerCase()}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className={`tx-value align-right ${tx.valor > 0 ? 'positive' : 'negative'}`}>
                      {tx.valor > 0 ? '+' : ''} R$ {Math.abs(tx.valor).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="empty-state">
                    Nenhuma transação encontrada com os filtros atuais.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};