import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/useAuth';
import { api } from '../../service/api';
import type { TipoCartao, StatusCartao } from '../../pages/cartoes/Cartoes';

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

export const useSolicitarCartao = () => {
  const { utilizador } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const solicitarCartao = async (
    tipo: TipoCartao,
    senhaTransacional: string
  ): Promise<BackendCartao | null> => {
    if (!utilizador?.id) {
      setError('Sessão expirada. Por favor, faça login novamente.');
      return null;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await api.post('/cartoes/solicitar', {
        contaId: utilizador.id,
        tipo,
        senhaTransacional
      });
      return response.data;
    } catch (err: unknown) {
      console.error("Erro ao solicitar cartão:", err);
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else if (err.response?.status === 400) {
          setError('Dados de solicitação inválidos ou senha incorreta.');
        } else {
          setError('Ocorreu um erro ao comunicar com o servidor. Tente novamente.');
        }
      } else {
        setError('Ocorreu um erro inesperado.');
      }
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { solicitarCartao, isSubmitting, error };
};
