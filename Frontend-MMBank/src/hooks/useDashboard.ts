import { useState, useEffect, useCallback } from 'react';
import { api } from '../service/api';

interface ContaDados {
  id: number;
  numeroConta: string;
  saldo: number;
  tipoConta: string;
  statusConta: string;
  totalEntradas?: number; 
  totalSaidas?: number;
}

export type TipoTransacao = 
  | 'PIX_ENVIADO' 
  | 'PIX_RECEBIDO' 
  | 'DEPOSITO' 
  | 'SAQUE' 
  | 'TRANSFERENCIA' 
  | 'PAGAMENTO_EMPRESTIMO' 
  | 'COMPRA_CREDITO' 
  | 'COMPRA_DEBITO';

interface TransacaoDados {
  id: number;
  tipo: TipoTransacao;
  valor: number; 
  data: string;  
  status: 'CONCLUIDA' | 'PENDENTE' | 'FALHA'; 
  categoria: string | null;
  endToEndId: string | null;
  ispbDestino: string | null;
}

export const useDashboard = (contaId: number = 1, itensPorPagina: number = 10) => {
  const [conta, setConta] = useState<ContaDados | null>(null);
  const [transacoesPaginadas, setTransacoesPaginadas] = useState<TransacaoDados[]>([]);
  const [transacoesTotais, setTransacoesTotais] = useState<TransacaoDados[]>([]); // <-- Lista cheia global
  const [paginaAtual, setPaginaAtual] = useState<number>(0);
  const [totalPaginas, setTotalPaginas] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [totalEntradas, setTotalEntradas] = useState<number>(0);
  const [totalSaidas, setTotalSaidas] = useState<number>(0);

  const carregarDadosDashboard = useCallback(async () => {
    if (!contaId || contaId === 0) {
      setLoading(false);
      setError("Nenhuma conta bancária associada. Por favor, abra uma conta para visualizar o seu painel.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const contaResponse = await api.get<ContaDados>(`/contas/${contaId}`);
      setConta(contaResponse.data);
      setTotalEntradas(contaResponse.data.totalEntradas || 0);
      setTotalSaidas(contaResponse.data.totalSaidas || 0);

      const todasResponse = await api.get<TransacaoDados[]>(`/transacoes/contas/${contaId}`);
      setTransacoesTotais(todasResponse.data || []);

      const transacoesResponse = await api.get(`/transacoes/contas/paginada/${contaId}`, {
        params: { page: paginaAtual, size: itensPorPagina }
      });
      
      setTransacoesPaginadas(transacoesResponse.data.content || []);
      setTotalPaginas(transacoesResponse.data.totalPages || 0);

    } catch (err) {
      console.error(err);
      setError("Erro ao sincronizar dados. A conta pode não existir.");
    } finally {
      setLoading(false);
    }
  }, [contaId, paginaAtual, itensPorPagina]);

  useEffect(() => {
    carregarDadosDashboard();
  }, [carregarDadosDashboard]);

  // Reseta a paginação ao trocar de conta no seletor
  useEffect(() => {
    setPaginaAtual(0);
  }, [contaId]);

 return {
    conta,
    transacoes: transacoesPaginadas, 
    transacoesTotais,               
    totalEntradas, 
    totalSaidas,   
    paginaAtual,
    totalPaginas,
    setPaginaAtual, 
    loading,
    error,
    refetch: carregarDadosDashboard
  };
};