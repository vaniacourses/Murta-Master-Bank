import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartoes } from '../../hooks/cartoes/useCartoes';

// Tipagens baseadas no seu Diagrama de Classes
export type TipoCartao = 'DEBITO' | 'CREDITO';
export type StatusCartao = 'ATIVO' | 'BLOQUEADO' | 'CANCELADO';

export interface ICartao {
  id: number;
  numero: string;
  cvv: number;
  dataValidade: string;
  limite: number;
  tipo: TipoCartao;
  status: StatusCartao;
  gastoAtual?: number;
  diaFechamento: number;
  diaPagamento: number; // Para controle de interface
}

export const Cartoes: React.FC = () => {
  const navigate = useNavigate();
  const { cartoes, isLoading, error, fetchCartoes } = useCartoes();

  const calcularDiasParaFechamento = (diaFechamento: number) => {
    if (!diaFechamento) return 0;
    const hoje = new Date();
    const diaAtual = hoje.getDate();

    if (diaAtual < diaFechamento) {
      return diaFechamento - diaAtual;
    } else {
      const diasNoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
      return (diasNoMes - diaAtual) + diaFechamento;
    }
  };

  // Handlers explícitos para navegação
  const handleExibirDetalhes = (id: number) => {
    navigate(`/cartoes/${id}`);
  };

  const handleExibirSolicitacao = () => {
    navigate('/cartoes/novo');
  };

  if (isLoading) {
    return (
      <div className="cartoes-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <p>A carregar cartões...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cartoes-container" style={{ textAlign: 'center', padding: '3rem' }}>
        <h1>Meus Cartões</h1>
        <p style={{ color: 'var(--danger)', margin: '2rem 0' }}>{error}</p>
        <button className="btn-primary" onClick={fetchCartoes}>
          Tentar Novamente
        </button>
      </div>
    );
  }

  // Visão Padrão: Lista de Cartões
  return (
    <div className="cartoes-container">
      <header className="cartoes-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Meus Cartões</h1>
          <p>Selecione um cartão para ver os detalhes ou solicite um novo.</p>
        </div>
        <button className="btn-primary" onClick={handleExibirSolicitacao}>
          + Novo Cartão
        </button>
      </header>

      {cartoes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--card-bg)', borderRadius: '12px' }}>
          <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Você não possui nenhum cartão ativo associado a esta conta.</p>
          <button className="btn-primary" onClick={handleExibirSolicitacao}>
            Solicitar Meu Primeiro Cartão
          </button>
        </div>
      ) : (
        <div className="cartoes-list-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {cartoes.map(cartao => (
            <div
              key={cartao.id}
              className="card"
              style={{ backgroundColor: cartao.tipo === 'CREDITO' ? '#1e293b' : '#3b82f6', color: 'white', padding: '1.5rem', borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.2s' }}
              onClick={() => handleExibirDetalhes(cartao.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h3>MMBank {cartao.tipo === 'CREDITO' ? 'Black' : 'Débito'}</h3>
                <span style={{ fontSize: '1.5rem' }}>💳</span>
              </div>
              <p style={{ fontSize: '1.2rem', letterSpacing: '2px', marginBottom: '1rem' }}>
                {cartao.numero}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: '0.9rem' }}>
                <span>Status: {cartao.status}</span>
                <span>Val: {cartao.dataValidade}</span>
              </div>

              {cartao.tipo === 'CREDITO' && cartao.diaFechamento > 0 && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem', color: '#fbbf24' }}>
                  ⏱ Fatura vira em <strong>{calcularDiasParaFechamento(cartao.diaFechamento)} dias</strong>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};