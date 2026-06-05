import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TipoCartao } from './Cartoes';
import { useSolicitarCartao } from '../../hooks/cartoes/useSolicitarCartao';

export const SolicitarCartao: React.FC = () => {
  const navigate = useNavigate();
  const { solicitarCartao, isSubmitting, error } = useSolicitarCartao();
  const [tipo, setTipo] = useState<TipoCartao>('CREDITO');
  const [senhaConfirmacao, setSenhaConfirmacao] = useState('');

  const handleVoltar = () => {
    navigate('/cartoes');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const resultado = await solicitarCartao(tipo, senhaConfirmacao);
    if (resultado) {
      alert(`Cartão de ${tipo.toLowerCase()} criado com sucesso!`);
      navigate('/cartoes');
    }
  };

  return (
    <div className="cartoes-container">
      <header className="cartoes-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={handleVoltar} className="btn-outline" style={{ padding: '0.5rem 1rem' }} disabled={isSubmitting}>← Voltar</button>
        <div>
          <h1>Solicitar Novo Cartão</h1>
          <p>Escolha o tipo de cartão que melhor atende às suas necessidades.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} style={{ maxWidth: '600px', backgroundColor: 'var(--card-bg)', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Tipo de Cartão</label>
          <select 
            value={tipo} 
            onChange={(e) => setTipo(e.target.value as TipoCartao)}
            disabled={isSubmitting}
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
          >
            <option value="CREDITO">Cartão de Crédito</option>
            <option value="DEBITO">Cartão de Débito</option>
          </select>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
            {tipo === 'CREDITO' 
              ? 'Sujeito à análise de crédito baseada na sua renda mensal informada.' 
              : 'O limite está atrelado ao saldo disponível na sua conta corrente.'}
          </p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Confirme sua senha transacional</label>
          <input 
            type="password" 
            required 
            placeholder="Digite sua senha de 4 a 6 dígitos"
            value={senhaConfirmacao}
            onChange={(e) => setSenhaConfirmacao(e.target.value)}
            disabled={isSubmitting}
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: isSubmitting ? 'not-allowed' : 'text' }}
          />
        </div>

        {error && <p style={{ color: 'var(--danger)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</p>}

        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', cursor: isSubmitting ? 'not-allowed' : 'pointer' }} disabled={isSubmitting}>
          {isSubmitting ? 'A processar solicitação...' : 'Confirmar Solicitação'}
        </button>
      </form>
    </div>
  );
};