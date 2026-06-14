import { useState, useEffect, useCallback } from 'react';
import { api } from '../service/api';


interface ContaDados {
  id: number;
  numeroConta: string;
  saldo: number;
  tipoConta: string;
  statusConta: string;
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
  const [transacoes, setTransacoes] = useState<TransacaoDados[]>([]);
  const [paginaAtual, setPaginaAtual] = useState<number>(0);
  const [totalPaginas, setTotalPaginas] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const carregarDadosDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const contaResponse = await api.get(`/contas/${contaId}`);
      setConta(contaResponse.data);

      
      const transacoesResponse = await api.get(`/transacoes/contas/${contaId}`, {
        params: { page: paginaAtual, size: itensPorPagina }
      });
      
      
      setTransacoes(transacoesResponse.data.content || []);
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

  const totalEntradas = transacoes
    .filter(t => {
      const ehEntradaNativa = t.tipo === 'PIX_RECEBIDO' || t.tipo === 'DEPOSITO';
      
      
      const ehTransferenciaRecebida = t.tipo === 'TRANSFERENCIA' && t.valor > 0; 
      
      return ehEntradaNativa || ehTransferenciaRecebida;
    })
    .reduce((sum, t) => sum + Math.abs(t.valor), 0);

  const totalSaidas = transacoes
    .filter(t => {
      const ehSaidaNativa = 
        t.tipo === 'PIX_ENVIADO' || 
        t.tipo === 'SAQUE' || 
        t.tipo === 'PAGAMENTO_EMPRESTIMO' || 
        t.tipo === 'COMPRA_DEBITO' || 
        t.tipo === 'COMPRA_CREDITO';
        
      const ehTransferenciaEnviada = t.tipo === 'TRANSFERENCIA' && (!ehSaidaNativa && t.valor < 0);

      return ehSaidaNativa || t.tipo === 'TRANSFERENCIA' || ehTransferenciaEnviada;
    })
    .reduce((sum, t) => sum + Math.abs(t.valor), 0);

  return {
    conta,
    transacoes,
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