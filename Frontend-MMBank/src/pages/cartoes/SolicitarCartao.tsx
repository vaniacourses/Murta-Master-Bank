import React, { useState } from 'react';
import type { ICartao, TipoCartao } from './Cartoes';

interface SolicitarCartaoProps {
  onVoltar: () => void;
  onCriar: (novoCartao: ICartao) => void;
}

export const SolicitarCartao: React.FC<SolicitarCartaoProps> = ({ onVoltar, onCriar }) => {
  const [tipo, setTipo] = useState<TipoCartao>('CREDITO');
  const [senhaConfirmacao, setSenhaConfirmacao] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulação do Back-end processando e gerando os dados da classe Cartao
    const novoCartaoGerado: ICartao = {
      id: Math.floor(Math.random() * 1000),
      numero: `**** **** **** ${Math.floor(1000 + Math.random() * 9000)}`, // Gerado pelo sistema
      cvv: Math.floor(100 + Math.random() * 900),
      dataValidade: '10/30',
      limite: tipo === 'CREDITO' ? 5000 : 0, // Analise de crédito simulada
      tipo: tipo,
      status: 'ATIVO',
      gastoAtual: 0
    };

    alert(`Cartão de ${tipo} criado com sucesso!`);
    onCriar(novoCartaoGerado);
  };

  return (
    <div className="cartoes-container">
      <header className="cartoes-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={onVoltar} className="btn-outline" style={{ padding: '0.5rem 1rem' }}>← Voltar</button>
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
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
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
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          />
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem' }}>
          Confirmar Solicitação
        </button>
      </form>
    </div>
  );
};