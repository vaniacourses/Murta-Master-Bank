import { useState, useEffect } from 'react';
import { api } from '../../service/api';
import type { ICartao, TipoCartao, StatusCartao } from '../../pages/cartoes/Cartoes';

interface BackendCartao {
  id: number;
  contaId: number;
  tipo: TipoCartao;
  limite: number;
  numeroCartao: string;
  cvv: string;
  dataValidade: string;
  dataEmissao: string;
  status: StatusCartao;
  diaFechamento: number;
  diaPagamento: number;
  gastoAtual?: number;
}

interface TransacaoResumo {
  id: number;
  valor: number;
  data: string;
  tipo: string;
  categoria: string;
  status: string;
}

const mapBackendToICartao = (b: BackendCartao): ICartao => {
  let validade = '12/31';
  if (b.dataValidade && typeof b.dataValidade === 'string' && b.dataValidade.includes('-')) {
    const parts = b.dataValidade.split('-');
    if (parts.length >= 2) {
      const yearShort = parts[0].slice(-2);
      const month = parts[1];
      validade = `${month}/${yearShort}`;
    }
  }

  return {
    id: b.id,
    numero: b.numeroCartao ? `**** **** **** ${b.numeroCartao.slice(-4)}` : '**** **** **** ****',
    cvv: Number(b.cvv) || 0,
    dataValidade: validade,
    limite: b.limite || 0,
    tipo: b.tipo,
    status: b.status,
    gastoAtual: b.gastoAtual || 0,
    diaFechamento: b.diaFechamento || 0,
    diaPagamento: b.diaPagamento || 5
  };
};

export const useCartaoDetalhes = (id: string | undefined) => {
  const [cartao, setCartao] = useState<ICartao | null>(null);
  const [transacoes, setTransacoes] = useState<TransacaoResumo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTx, setIsLoadingTx] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [errorTx, setErrorTx] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchCartao = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await api.get(`/cartoes/${id}`);
        setCartao(mapBackendToICartao(response.data));
      } catch (err: unknown) {
        console.error("Erro ao carregar detalhes do cartão:", err);
        setError('Não foi possível carregar os detalhes do cartão.');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTransacoes = async () => {
      setIsLoadingTx(true);
      setErrorTx('');
      try {
        const response = await api.get(`/cartoes/${id}/transacoes-recentes`);
        setTransacoes(response.data);
      } catch (err: unknown) {
        console.error("Erro ao buscar transações do cartão:", err);
        setErrorTx('Não foi possível carregar as transações recentes.');
      } finally {
        setIsLoadingTx(false);
      }
    };

    fetchCartao();
    fetchTransacoes();
  }, [id]);

  const toggleStatus = async (): Promise<boolean> => {
    if (!cartao) return false;
    setIsUpdating(true);
    const novoStatus = cartao.status === 'BLOQUEADO' ? 'ATIVO' : 'BLOQUEADO';
    try {
      const response = await api.put(`/cartoes/${cartao.id}/status`, {
        status: novoStatus
      });
      const updated = mapBackendToICartao(response.data);
      setCartao(updated);
      return true;
    } catch (err: unknown) {
      console.error("Erro ao atualizar status do cartão:", err);
      alert('Erro ao alterar as configurações de segurança do cartão.');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteCartao = async (): Promise<boolean> => {
    if (!cartao) return false;
    const confirmacao = window.confirm(
      'Deseja realmente cancelar e excluir este cartão permanentemente? Esta operação não pode ser desfeita.'
    );
    if (!confirmacao) return false;

    setIsUpdating(true);
    try {
      await api.delete(`/cartoes/${cartao.id}`);
      return true;
    } catch (err: unknown) {
      console.error("Erro ao excluir cartão:", err);
      alert('Não foi possível cancelar/excluir este cartão.');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    cartao,
    transacoes,
    isLoading,
    isLoadingTx,
    isUpdating,
    error,
    errorTx,
    toggleStatus,
    deleteCartao
  };
};
