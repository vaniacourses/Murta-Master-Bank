import React, { useState } from 'react';
import type { ICartao } from './Cartoes';
import './UniqueCartao.css'; // Mantenha seu CSS original

interface UniqueCartoesProps {
  cartao: ICartao;
  onVoltar: () => void;
}

export const Cartao: React.FC<UniqueCartoesProps> = ({ cartao, onVoltar }) => {
  const [bloqueado, setBloqueado] = useState(cartao.status === 'BLOQUEADO');
  

  const percentualUso = cartao.tipo === 'CREDITO' && cartao.limite > 0 
    ? ((cartao.gastoAtual || 0) / cartao.limite) * 100 
    : 0;

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
        <div className="card-control-panel">
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
            {cartao.tipo === 'CREDITO' && (
               <button className="btn-action secondary">Ver Fatura PDF</button>
            )}
          </div>
        </div>

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
            </div>
          ) : (
             <div className="limit-card">
               <h3>Cartão de Débito</h3>
               <p style={{ color: 'var(--text-main)', marginTop: '0.5rem' }}>Os gastos deste cartão são debitados diretamente do saldo da sua Conta Corrente.</p>
             </div>
          )}

          <div className="invoice-transactions">
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
      </div>
    </div>
  );
};