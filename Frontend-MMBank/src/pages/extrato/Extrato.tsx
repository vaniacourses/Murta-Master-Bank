import React, { useState, useMemo } from 'react';
import { useAuth } from '../../hooks/auth/useAuth'; // Caminho do seu hook de autenticação
import { useExtrato } from '../../hooks/useExtrato'; // Caminho do hook que criamos acima
import './Extrato.css';

export const Extrato: React.FC = () => {
  const { utilizador } = useAuth();
  
  // Consome o hook passando o ID da conta do usuário logado
  // Nota: Se o seu backend buscar por ID da Conta em vez de ID do Cliente, 
  // certifique-se de passar o ID da conta correto aqui (ex: utilizador?.contaId)
  const { transacoesTotais, loading, error } = useExtrato(utilizador?.id);

  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('TODOS');
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');

  // Lógica de filtragem reativa baseada nos dados vindos do backend
  const transacoesFiltradas = useMemo(() => {
    if (!Array.isArray(transacoesTotais)) return [];

    return transacoesTotais.filter(tx => {
      if (!tx) return false;

      const categoriaNome = tx.categoria || 'Outros';
      const tipoNome = tx.tipo || '';

      const matchBusca = 
        categoriaNome.toLowerCase().includes(busca.toLowerCase()) || 
        tipoNome.replace('_', ' ').toLowerCase().includes(busca.toLowerCase());
        
      const matchTipo = filtroTipo === 'TODOS' || tx.tipo === filtroTipo;
      const matchStatus = filtroStatus === 'TODOS' || tx.status === filtroStatus;

      return matchBusca && matchTipo && matchStatus;
    });
  }, [transacoesTotais, busca, filtroTipo, filtroStatus]);

  const formatarTipo = (tipo: string) => {
    if (!tipo) return '';
    return tipo.replace('_', ' ').replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
  };

  if (loading) {
    return (
      <div className="extrato-container" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: '#888', fontSize: '1.2rem' }}>A carregar o extrato das transações...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="extrato-container" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: '#dc3545', fontSize: '1.2rem' }}>{error}</p>
      </div>
    );
  }

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
                transacoesFiltradas.map((tx) => {
                  const ehSaida =
                    tx.tipo !== "PIX_RECEBIDO" &&
                    tx.tipo !== "DEPOSITO" &&
                    !(tx.tipo === "TRANSFERENCIA" && tx.valor > 0);

                  return (
                    <tr key={tx.id}>
                      <td className="tx-date">
                        {tx.data 
                          ? new Date(tx.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) 
                          : '---'}
                      </td>
                      <td className="tx-info">
                        <strong>{tx.categoria || 'Outros'}</strong>
                        <span>{formatarTipo(tx.tipo)}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${(tx.status || 'PENDENTE').toLowerCase()}`}>
                          {tx.status || 'PENDENTE'}
                        </span>
                      </td>
                      <td className={`tx-value align-right ${!ehSaida ? 'positive' : 'negative'}`}>
                        {!ehSaida ? '+' : '-'} R$ {Math.abs(tx.valor).toFixed(2)}
                      </td>
                    </tr>
                  );
                })
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