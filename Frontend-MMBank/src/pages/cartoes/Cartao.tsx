import React, { useState } from 'react';
import type { ICartao } from './Cartoes';
import './UniqueCartao.css';

interface UniqueCartoesProps {
  cartao: ICartao;
  onVoltar: () => void;
}

export const Cartao: React.FC<UniqueCartoesProps> = ({ cartao, onVoltar }) => {
  const [bloqueado, setBloqueado] = useState(cartao.status === 'BLOQUEADO');

  // Lógica de uso do limite
  const percentualUso = cartao.tipo === 'CREDITO' && cartao.limite > 0 
    ? ((cartao.gastoAtual || 0) / cartao.limite) * 100 
    : 0;

  // Lógica de Fechamento da Fatura
  const hoje = new Date();
  const diaAtual = hoje.getDate();
  
  
  const diaFechamento = cartao.diaFechamento || 25; 
  const isFaturaAberta = diaAtual < diaFechamento;

  return (
    <div className="cartoes-container">
      <header className="cartoes-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={onVoltar} className="btn-outline" style={{ padding: '0.5rem 1rem' }}>← Voltar</button>
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

          <div className="invoice-transactions" style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#ffffff', borderRadius: '8px'}}>
            <h3>Gastos Recentes no Cartão</h3>
            <div className="tx-list">
              {['Amazon Prime', 'Uber *Trip', 'Restaurante Sabor'].map((item, i) => (
                <div key={i} className="tx-item">
                  <span>{item}</span>
                  <strong>R$ {((i + 1) * 45 + 10).toFixed(2)}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card-control-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <div className={`card-visual ${bloqueado ? 'locked' : ''}`} style={{ backgroundColor: cartao.tipo === 'CREDITO' ? '#1e293b' : '#3b82f6' }}>
            <div className="card-chip"></div>
            <div className="card-number">{cartao.numero}</div>
            <div className="card-holder">GUSTAVO MURTA</div>
          </div>

          <div className="card-actions">
            <button 
              className={`btn-action ${bloqueado ? 'unlock' : 'lock'}`}
              onClick={() => setBloqueado(!bloqueado)}
            >
              {bloqueado ? 'Desbloquear Cartão' : 'Bloquear Cartão'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};