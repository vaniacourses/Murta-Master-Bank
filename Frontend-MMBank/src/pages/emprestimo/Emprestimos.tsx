import React, { useEffect, useState } from 'react';
import { SolicitarEmprestimo } from './SolicitarEmprestimo';
import { Emprestimo } from './Emprestimo';
import { useAuth } from '../../hooks/auth/useAuth';
import { emprestimoService, type Emprestimo as EmprestimoModel, type Parcela as ParcelaModel } from '../../service/emprestimoService';
import './Emprestimos.css';

export type IParcela = ParcelaModel;
export type IEmprestimo = EmprestimoModel;

export const Emprestimos: React.FC = () => {
  const { utilizador } = useAuth();
  const [view, setView] = useState<'LISTA' | 'DETALHES' | 'NOVO'>('LISTA');
  const [emprestimos, setEmprestimos] = useState<IEmprestimo[]>([]);
  const [emprestimoSelecionado, setEmprestimoSelecionado] = useState<IEmprestimo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState('');

  const carregarEmprestimos = async () => {
    if (!utilizador?.id) {
      setEmprestimos([]);
      setEmprestimoSelecionado(null);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const dados = await emprestimoService.listarPorConta(utilizador.id);
      setEmprestimos(dados);
      setEmprestimoSelecionado((atual) => dados.find((item) => item.id === atual?.id) ?? null);
    } catch (err) {
      console.error('Erro ao carregar empréstimos:', err);
      setError('Não foi possível carregar seus empréstimos. Verifique a conexão com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarEmprestimos();
  }, [utilizador?.id]);

  const handleNovoEmprestimo = (novo: IEmprestimo) => {
    setEmprestimos((atual) => [novo, ...atual]);
    setView('LISTA');
    alert('Empréstimo criado com sucesso!');
  };

  const handlePagarParcela = async (parcelaId: number) => {
    if (!emprestimoSelecionado || isPaying) return;
    
    const confirm = window.confirm('Confirmar o pagamento desta parcela com o saldo da conta?');
    if (!confirm) {
      return;
    }

    setIsPaying(true);
    setError('');

    try {
      await emprestimoService.pagarParcela(parcelaId);
      await carregarEmprestimos();
      alert('Parcela paga com sucesso!');
    } catch (err: any) {
      console.error('Erro ao pagar parcela:', err);
      const msg = err?.response?.data?.message || err?.response?.data || 'Não foi possível pagar a parcela. Verifique seu saldo e tente novamente.';
      alert(msg);
    } finally {
      setIsPaying(false);
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
              Contratar Empréstimo
            </button>
          </header>

          {error && <p className="empty-state">{error}</p>}

          {isLoading ? (
            <p className="empty-state">Carregando empréstimos...</p>
          ) : emprestimos.length === 0 ? (
            <p className="empty-state">Você ainda não possui empréstimos cadastrados.</p>
          ) : (
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
          )}
        </>
      )}
      
    </div>
  );
};