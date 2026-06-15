import { useState, useEffect } from 'react';
import { api } from '../service/api';

// Tipagens alinhadas com o seu modelo de dados do MMBank
type TipoTransacao = 'PIX_ENVIADO' | 'PIX_RECEBIDO' | 'DEPOSITO' | 'SAQUE' | 'TRANSFERENCIA' | 'PAGAMENTO_EMPRESTIMO';
type StatusTransacao = 'PENDENTE' | 'CONCLUIDA' | 'FALHA';

export interface Transacao {
  id: number;
  tipo: TipoTransacao;
  valor: number;
  data: string;
  status: StatusTransacao;
  categoria: string;
}

export const useExtrato = (contaId: number | undefined) => {
  const [transacoesTotais, setTransacoesTotais] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fetchExtrato = async () => {
    if (!contaId) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Faz o GET na rota do backend que lista todas as transações da conta
      const response = await api.get<Transacao[]>(`/transacoes/contas/${contaId}`);
      setTransacoesTotais(response.data);
    } catch (err: unknown) {
      console.error("Erro ao carregar o extrato:", err);
      setError('Não foi possível carregar o histórico de transações.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExtrato();
  }, [contaId]);

  return { transacoesTotais, loading, error, refetch: fetchExtrato };
};