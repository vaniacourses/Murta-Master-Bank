import React, { useState } from 'react';
import { SolicitarEmprestimo } from './SolicitarEmprestimo';
import { Emprestimo } from './Emprestimo';
import './Emprestimos.css';

// --- Tipagens Compartilhadas ---
export type StatusEmprestimo = 'APROVADO' | 'EM_ANALISE' | 'RECUSADO';
export type StatusParcela = 'PENDENTE' | 'PAGO' | 'ATRASADO';

export interface IParcela {
  id: number;
  numero: number;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string | null;
  status: StatusParcela;
}

export interface IEmprestimo {
  id: number;
  valorTotal: number;
  taxaJuros: number;
  qtdParcelas: number;
  valorParcelas: number;
  dataInicio: string;
  status: StatusEmprestimo;
  parcelas: IParcela[];
}

// --- Mocks Iniciais ---
const mockParcelas: IParcela[] = [
  { id: 101, numero: 1, valor: 541.66, dataVencimento: '2026-05-10', dataPagamento: '2026-05-08', status: 'PAGO' },
  { id: 102, numero: 2, valor: 541.66, dataVencimento: '2026-06-10', dataPagamento: null, status: 'PENDENTE' },
  { id: 103, numero: 3, valor: 541.66, dataVencimento: '2026-07-10', dataPagamento: null, status: 'PENDENTE' },
];

const mockEmprestimos: IEmprestimo[] = [
  { id: 1, valorTotal: 5000.00, taxaJuros: 2.5, qtdParcelas: 12, valorParcelas: 541.66, dataInicio: '2026-04-10', status: 'APROVADO', parcelas: mockParcelas },
  { id: 2, valorTotal: 15000.00, taxaJuros: 2.0, qtdParcelas: 24, valorParcelas: 800.00, dataInicio: '2026-06-01', status: 'EM_ANALISE', parcelas: [] }
];

export const Emprestimos: React.FC = () => {
  const [view, setView] = useState<'LISTA' | 'DETALHES' | 'NOVO'>('LISTA');
  const [emprestimos, setEmprestimos] = useState<IEmprestimo[]>(mockEmprestimos);
  const [emprestimoSelecionado, setEmprestimoSelecionado] = useState<IEmprestimo | null>(null);

  const handleNovoEmprestimo = (novo: IEmprestimo) => {
    setEmprestimos([...emprestimos, novo]);
    setView('LISTA');
    alert('Solicitação enviada para análise com sucesso!');
  };

  const handlePagarParcela = (parcelaId: number) => {
    if (!emprestimoSelecionado) return;
    
    const confirm = window.confirm('Confirmar o pagamento desta parcela com o saldo da conta?');
    if (confirm) {
      // Atualiza a parcela específica
      const parcelasAtualizadas = emprestimoSelecionado.parcelas.map(p => 
        p.id === parcelaId ? { ...p, status: 'PAGO' as StatusParcela, dataPagamento: new Date().toISOString().split('T')[0] } : p
      );
      
      const emprestimoAtualizado = { ...emprestimoSelecionado, parcelas: parcelasAtualizadas };
      
      // Atualiza o estado do selecionado e da lista principal
      setEmprestimoSelecionado(emprestimoAtualizado);
      setEmprestimos(emprestimos.map(e => e.id === emprestimoAtualizado.id ? emprestimoAtualizado : e));
      alert('Parcela paga com sucesso!');
    }
  };

  return (
    <div className="emprestimos-container">
      
      {view === 'NOVO' && (
        <SolicitarEmprestimo onVoltar={() => setView('LISTA')} onSolicitar={handleNovoEmprestimo} />
      )}

      {view === 'DETALHES' && emprestimoSelecionado && (
        <Emprestimo 
          emprestimo={emprestimoSelecionado} 
          onVoltar={() => setView('LISTA')} 
          onPagarParcela={handlePagarParcela} 
        />
      )}

      {view === 'LISTA' && (
        <>
          <header className="emprestimos-header">
            <div>
              <h1>Meus Empréstimos</h1>
              <p>Gerencie seus contratos e simule novas opções de crédito.</p>
            </div>
            <button className="btn-primary" onClick={() => setView('NOVO')}>
              Simular Empréstimo
            </button>
          </header>

          <div className="emprestimos-grid">
            {emprestimos.map(emp => (
              <div 
                key={emp.id} 
                className="card-box cursor-pointer" 
                onClick={() => { setEmprestimoSelecionado(emp); setView('DETALHES'); }}
              >
                <div className="card-header">
                  <h3>Contrato #{emp.id}</h3>
                  <span className={`status-badge ${emp.status.toLowerCase()}`}>
                    {emp.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="card-body">
                  <div className="data-row">
                    <span>Valor Total:</span>
                    <strong>R$ {emp.valorTotal.toFixed(2)}</strong>
                  </div>
                  <div className="data-row">
                    <span>Parcelas:</span>
                    <strong>{emp.qtdParcelas}x de R$ {emp.valorParcelas.toFixed(2)}</strong>
                  </div>
                  <div className="data-row">
                    <span>Taxa de Juros:</span>
                    <strong>{emp.taxaJuros}% a.m.</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
    </div>
  );
};