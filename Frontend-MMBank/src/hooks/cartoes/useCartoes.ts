import { useState, useEffect } from 'react';
import { useAuth } from '../auth/useAuth';
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

export const useCartoes = () => {
  const { utilizador } = useAuth();
  const [cartoes, setCartoes] = useState<ICartao[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCartoes = async () => {
    if (!utilizador?.id) return;
    setIsLoading(true);
    setError('');
    try {
      // 🌟 BUSCA DIRETO DA FONTE NO MOMENTO DO CLIQUE/RENDER
      const tokenSalvo = localStorage.getItem('@MMBank:token');

      const response = await api.get(`/cartoes/conta/${utilizador.id}`, {
        headers: {
          // Injeta manualmente para garantir que não vai vazio
          Authorization: `Bearer ${tokenSalvo}`
        }
      });
      
      const mapped = response.data.map(mapBackendToICartao);
      setCartoes(mapped);
    } catch (err: unknown) {
      console.error("Erro ao carregar cartões:", err);
      setError('Não foi possível carregar os cartões.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCartoes();
  }, [utilizador?.id]);

  return { cartoes, isLoading, error, fetchCartoes };
};