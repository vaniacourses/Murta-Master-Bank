import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/auth/useAuth';
import { useCartaoDetalhes } from '../../hooks/cartoes/useCartaoDetalhes';
import './UniqueCartao.css';

export const Cartao: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { utilizador } = useAuth();
  const {
    cartao,
    transacoes,
    isLoading,
    isLoadingTx,
    isUpdating,
    error,
    errorTx,
    toggleStatus,
    deleteCartao
  } = useCartaoDetalhes(id);

  // Handlers de navegação
  const handleVoltar = () => {
    navigate('/cartoes');
  };

  const handleToggleStatus = async () => {
    await toggleStatus();
  };

  const handleDelete = async () => {
    const deleted = await deleteCartao();
    if (deleted) {
      alert('Cartão excluído com sucesso.');
      navigate('/cartoes');
    }
  };

  if (isLoading) {
    return (
      <div className="cartoes-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <p>A carregar detalhes do cartão...</p>
      </div>
    );
  }

  if (error || !cartao) {
    return (
      <div className="cartoes-container" style={{ textAlign: 'center', padding: '3rem' }}>
        <h1>Detalhes do Cartão</h1>
        <p style={{ color: 'var(--danger)', margin: '2rem 0' }}>{error || 'Cartão não encontrado.'}</p>
        <button className="btn-primary" onClick={handleVoltar}>
          Voltar para Cartões
        </button>
      </div>
    );
  }

  // Lógica de uso do limite
  const percentualUso = cartao.tipo === 'CREDITO' && cartao.limite > 0
    ? ((cartao.gastoAtual || 0) / cartao.limite) * 100
    : 0;

  // Lógica de Fechamento da Fatura
  const hoje = new Date();
  const diaAtual = hoje.getDate();
  const diaFechamento = cartao.diaFechamento || 25;
  const isFaturaAberta = diaAtual < diaFechamento;
  const bloqueado = cartao.status === 'BLOQUEADO';

  return (
    <div className="cartoes-container">
      <header className="cartoes-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={handleVoltar} className="btn-outline" style={{ padding: '0.5rem 1rem' }}>← Voltar</button>
        <div>
          <h1>Detalhes do Cartão</h1>
          <p>Gerencie limites e segurança do seu cartão MMBank {cartao.tipo}.</p>
        </div>
      </header>

      <div className="cartoes-grid">
        <div className="card-data-panel">
          {cartao.tipo === 'CREDITO' ? (
            <div className="limit-card">
              <h3>Limite Disponível</h3>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${percentualUso}%` }}></div>
              </div>
              <div className="limit-details">
                <span>Gasto: R$ {(cartao.gastoAtual || 0).toFixed(2)}</span>
                <strong>Total: R$ {cartao.limite.toFixed(2)}</strong>
              </div>

              <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '8px', color: '#0f172a' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>Status da Fatura</h4>
                <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                  {isFaturaAberta
                    ? `Fatura Aberta. Fechamento ocorre todo dia ${diaFechamento}.`
                    : `Fatura Fechada! Vencimento no dia ${cartao.diaPagamento || 5}.`}
                </p>
                <button
                  className="btn-action secondary"
                  disabled={isFaturaAberta}
                  style={{
                    opacity: isFaturaAberta ? 0.6 : 1,
                    cursor: isFaturaAberta ? 'not-allowed' : 'pointer',
                    width: '100%'
                  }}
                  onClick={() => console.log('Chamaria a rota do back-end para baixar o PDF')}
                >
                  {isFaturaAberta ? 'Disponível após o fechamento' : 'Baixar Fatura PDF'}
                </button>
              </div>
            </div>
          ) : (
            <div className="limit-card">
              <h3>Cartão de Débito</h3>
              <p style={{ color: 'var(--text-main)', marginTop: '0.5rem' }}>Os gastos deste cartão são debitados diretamente do saldo da sua Conta Corrente.</p>
            </div>
          )}

          <div className="invoice-transactions" style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#ffffff', borderRadius: '8px' }}>
            <h3>Gastos Recentes no Cartão</h3>
            <div className="tx-list">
              {isLoadingTx ? (
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>A carregar transações...</p>
              ) : errorTx ? (
                <p style={{ fontSize: '0.9rem', color: 'var(--danger)' }}>{errorTx}</p>
              ) : transacoes.length === 0 ? (
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Nenhum gasto recente registrado para este cartão.</p>
              ) : (
                transacoes.map((tx) => (
                  <div key={tx.id} className="tx-item">
                    <span>{tx.categoria || tx.tipo.replace('_', ' ')}</span>
                    <strong style={{ color: tx.valor < 0 ? 'var(--danger)' : 'var(--success)' }}>
                      R$ {Math.abs(tx.valor).toFixed(2)}
                    </strong>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="card-control-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <div className={`card-visual ${bloqueado ? 'locked' : ''}`} style={{ backgroundColor: cartao.tipo === 'CREDITO' ? '#1e293b' : '#3b82f6' }}>
            <div className="card-chip"></div>
            <div className="card-number">{cartao.numero}</div>
            <div className="card-holder">{utilizador?.nome ? utilizador.nome.toUpperCase() : 'TITULAR MMBANK'}</div>
          </div>

          <div className="card-actions" style={{ width: '100%', maxWidth: '320px' }}>
            <button
              className={`btn-action ${bloqueado ? 'unlock' : 'lock'}`}
              onClick={handleToggleStatus}
              disabled={isUpdating}
              style={{ width: '100%', cursor: isUpdating ? 'not-allowed' : 'pointer' }}
            >
              {isUpdating ? 'A processar...' : (bloqueado ? 'Desbloquear Cartão' : 'Bloquear Cartão')}
            </button>

            <button
              className="btn-action"
              onClick={handleDelete}
              disabled={isUpdating}
              style={{
                width: '100%',
                backgroundColor: 'var(--danger)',
                color: 'white',
                marginTop: '1rem',
                cursor: isUpdating ? 'not-allowed' : 'pointer'
              }}
            >
              Cancelar/Excluir Cartão
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};