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
    try {
      setLoading(true);
      setError(null);

      // 1. Busca os dados consolidados da conta e seus totais macro
      const contaResponse = await api.get<ContaDados>(`/contas/${contaId}`);
      setConta(contaResponse.data);
      setTotalEntradas(contaResponse.data.totalEntradas || 0);
      setTotalSaidas(contaResponse.data.totalSaidas || 0);

      // 2. Busca TODAS as transações sem limitação de página para o Gráfico de Pizza
      const todasResponse = await api.get<TransacaoDados[]>(`/transacoes/contas/${contaId}`);
      setTransacoesTotais(todasResponse.data || []);

      // 3. Busca o lote restrito à página atual apenas para preencher a tabela do extrato
      const transacoesResponse = await api.get(`/transacoes/contas/paginada/${contaId}`, {
        params: { page: paginaAtual, size: itensPorPagina }
      });
      
      setTransacoesPaginadas(transacoesResponse.data.content || []);
      setTotalPaginas(transacoesResponse.data.totalPages || 0);

    } catch (err) {
      console.error(err);
      setError("Erro ao sincronizar dados.");
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