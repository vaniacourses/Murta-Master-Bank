import React, { useState } from 'react';
import type { IEmprestimo } from './Emprestimos';

interface SolicitarEmprestimoProps {
  onVoltar: () => void;
  onSolicitar: (novoEmprestimo: IEmprestimo) => void;
}

export const SolicitarEmprestimo: React.FC<SolicitarEmprestimoProps> = ({ onVoltar, onSolicitar }) => {
  const [valorSimulado, setValorSimulado] = useState<string>('');
  const [qtdParcelasSimuladas, setQtdParcelasSimuladas] = useState<number>(12);
  const taxaJurosMensal = 2.5; // Taxa fixa simulada do banco

  const calcularSimulacao = () => {
    const valor = parseFloat(valorSimulado);
    if (isNaN(valor) || valor <= 0) return 0;
    
    // Fórmula Price: PMT = PV * i / (1 - (1+i)^-n)
    const i = taxaJurosMensal / 100;
    const n = qtdParcelasSimuladas;
    const pmt = (valor * i) / (1 - Math.pow(1 + i, -n));
    return pmt;
  };

  const handleSolicitar = (e: React.FormEvent) => {
    e.preventDefault();
    const valor = parseFloat(valorSimulado);
    if (isNaN(valor) || valor <= 0) {
      alert('Insira um valor válido.');
      return;
    }

    const novoEmprestimo: IEmprestimo = {
      id: Math.floor(Math.random() * 1000),
      valorTotal: valor,
      taxaJuros: taxaJurosMensal,
      qtdParcelas: qtdParcelasSimuladas,
      valorParcelas: calcularSimulacao(),
      dataInicio: new Date().toISOString().split('T')[0],
      status: 'EM_ANALISE',
      parcelas: [] // Serão geradas pelo back-end após aprovação
    };

    onSolicitar(novoEmprestimo);
  };

  return (
    <>
      <header className="emprestimos-header">
        <button onClick={onVoltar} className="btn-outline">← Cancelar</button>
        <div>
          <h1>Simular Empréstimo</h1>
          <p>Descubra as melhores condições de crédito para você.</p>
        </div>
      </header>

      <div className="simulacao-grid">
        <div className="card-box form-panel">
          <form onSubmit={handleSolicitar}>
            <div className="input-group">
              <label>De quanto você precisa?</label>
              <input 
                type="number" 
                placeholder="R$ 0,00" 
                value={valorSimulado} 
                onChange={e => setValorSimulado(e.target.value)} 
                required 
              />
            </div>
            
            <div className="input-group mt-3">
              <label>Em quantas vezes quer pagar?</label>
              <select 
                value={qtdParcelasSimuladas} 
                onChange={e => setQtdParcelasSimuladas(Number(e.target.value))}
              >
                <option value={6}>6 vezes</option>
                <option value={12}>12 vezes</option>
                <option value={24}>24 vezes</option>
                <option value={36}>36 vezes</option>
                <option value={48}>48 vezes</option>
              </select>
            </div>

            <button type="submit" className="btn-primary full-width mt-4">
              Enviar para Análise
            </button>
          </form>
        </div>

        <div className="card-box resultado-panel">
          <h3>Resultado da Simulação</h3>
          {valorSimulado && Number(valorSimulado) > 0 ? (
            <div className="resultado-dados">
              <div className="dado-destaque">
                <span>Valor da Parcela:</span>
                <h2>R$ {calcularSimulacao().toFixed(2)}</h2>
              </div>
              <ul className="dados-lista">
                <li>Valor Solicitado: <strong>R$ {parseFloat(valorSimulado).toFixed(2)}</strong></li>
                <li>Quantidade de Parcelas: <strong>{qtdParcelasSimuladas}x</strong></li>
                <li>Taxa de Juros: <strong>{taxaJurosMensal}% a.m.</strong></li>
                <li>Total a Pagar: <strong>R$ {(calcularSimulacao() * qtdParcelasSimuladas).toFixed(2)}</strong></li>
              </ul>
              <p className="aviso-simulacao">Valores sujeitos à análise de crédito no momento da contratação.</p>
            </div>
          ) : (
            <p className="empty-state">Preencha os dados ao lado para ver a simulação.</p>
          )}
        </div>
      </div>
    </>
  );
};