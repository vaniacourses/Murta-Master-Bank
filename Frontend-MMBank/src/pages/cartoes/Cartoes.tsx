import React, { useState } from 'react';
import { Cartao } from './Cartao';
import { SolicitarCartao } from './SolicitarCartao';

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
  diaPagamento:number; // Para controle de interface
}

// Mocks iniciais
const cartoesMocks: ICartao[] = [
  { id: 1, numero: '**** **** **** 4021', cvv: 123, dataValidade: '12/29', limite: 10000, tipo: 'CREDITO', status: 'ATIVO', gastoAtual: 3450.50, diaFechamento: 25, diaPagamento: 20 },
  { id: 2, numero: '**** **** **** 8899', cvv: 456, dataValidade: '05/28', limite: 0, tipo: 'DEBITO', status: 'ATIVO', gastoAtual: 0, diaFechamento: 0, diaPagamento: 0 },
];

export const Cartoes: React.FC = () => {
  const [view, setView] = useState<'LISTA' | 'DETALHES' | 'NOVO'>('LISTA');
  const [cartoes, setCartoes] = useState<ICartao[]>(cartoesMocks);
  const [cartaoSelecionado, setCartaoSelecionado] = useState<ICartao | null>(null);

  const calcularDiasParaFechamento = (diaFechamento: number) => {
    if (!diaFechamento) return 0;
    const hoje = new Date();
    const diaAtual = hoje.getDate();
    
    if (diaAtual < diaFechamento) {
      return diaFechamento - diaAtual;
    } else {
      // Já passou do fechamento deste mês. Calcula os dias até o diaFechamento do mês seguinte.
      // Descobre quantos dias tem o mês atual
      const diasNoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
      return (diasNoMes - diaAtual) + diaFechamento;
    }
  };

  const handleSelecionarCartao = (cartao: ICartao) => {
    setCartaoSelecionado(cartao);
    setView('DETALHES');
  };

  const handleNovoCartao = (novoCartao: ICartao) => {
    setCartoes([...cartoes, novoCartao]);
    setView('LISTA');
  };

  

  // Renderização Condicional
  if (view === 'DETALHES' && cartaoSelecionado) {
    return <Cartao cartao={cartaoSelecionado} onVoltar={() => setView('LISTA')} />;
  }

  if (view === 'NOVO') {
    return <SolicitarCartao onVoltar={() => setView('LISTA')} onCriar={handleNovoCartao} />;
  }

  // Visão Padrão: Lista de Cartões
  return (
    <div className="cartoes-container">
      <header className="cartoes-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Meus Cartões</h1>
          <p>Selecione um cartão para ver os detalhes ou solicite um novo.</p>
        </div>
        <button className="btn-primary" onClick={() => setView('NOVO')}>
          + Novo Cartão
        </button>
      </header>

      <div className="cartoes-list-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {cartoes.map(cartao => (
          <div 
            key={cartao.id} 
            className="card" 
            style={{ backgroundColor: cartao.tipo === 'CREDITO' ? '#1e293b' : '#3b82f6', color: 'white', padding: '1.5rem', borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.2s' }}
            onClick={() => handleSelecionarCartao(cartao)}
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
    </div>
  );
};