import React from 'react';
import type { IEmprestimo } from './Emprestimos';

interface EmprestimoProps {
  emprestimo: IEmprestimo;
  onVoltar: () => void;
  onPagarParcela: (parcelaId: number) => Promise<void>;
}

export const Emprestimo: React.FC<EmprestimoProps> = ({ emprestimo, onVoltar, onPagarParcela }) => {
  const possuiParcelas = emprestimo.parcelas.length > 0;

  return (
    <>
      <header className="emprestimos-header">
        <button onClick={onVoltar} className="btn-outline">← Voltar</button>
        <div>
          <h1>Detalhes do Contrato #{emprestimo.id}</h1>
          <p>Acompanhe o pagamento das suas parcelas.</p>
        </div>
      </header>

      <div className="detalhes-content">
        <div className="card-box resumo-panel">
          <h3>Resumo</h3>
          <h2>R$ {emprestimo.valorTotal.toFixed(2)}</h2>
          <p>{emprestimo.qtdParcelas}x de R$ {emprestimo.valorParcelas.toFixed(2)}</p>
          <span className={`status-badge ${emprestimo.status.toLowerCase()} mt-2`}>
            Status: {emprestimo.status.replace('_', ' ')}
          </span>
        </div>

        <div className="card-box parcelas-panel">
          <h3>Cronograma de Parcelas</h3>
          {emprestimo.status !== 'ATIVO' ? (
            <p className="empty-state">As parcelas serão geradas após a aprovação do empréstimo.</p>
          ) : !possuiParcelas ? (
            <p className="empty-state">Este contrato ainda não possui parcelas disponíveis.</p>
          ) : (
            <div className="parcelas-list">
              {emprestimo.parcelas.map(parcela => (
                <div key={parcela.id} className="parcela-item">
                  <div className="parcela-info">
                    <strong>{parcela.numero}ª Parcela</strong>
                    <span>Vence em: {new Date(parcela.dataVencimento).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="parcela-valor">
                    <strong>R$ {parcela.valor.toFixed(2)}</strong>
                    <span className={`status-text ${parcela.status.toLowerCase()}`}>{parcela.status}</span>
                  </div>
                  <div className="parcela-acao">
                    {parcela.status === 'PENDENTE' || parcela.status === 'ATRASADO' ? (
                      <button className="btn-pay" onClick={() => onPagarParcela(parcela.id)}>Pagar</button>
                    ) : (
                      <span className="paid-check">✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};