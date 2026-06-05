import { useState } from 'react';
import { transferenciaService } from '../service/tranferenciaService';
import type { TransferenciaRequestDTO, TransferenciaResponseDTO } from '../types/dtos';

export const useTransferencia = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<TransferenciaResponseDTO | null>(null);

  const realizarTransferencia = async (dados: TransferenciaRequestDTO) => {
    setIsLoading(true);
    setError(null);
    setSucesso(null);

    try {
      const response = await transferenciaService.realizar(dados);
      setSucesso(response);
      return response;
    } catch (err) {
      setError( 'Erro ao realizar transferência. Verifique o seu saldo.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { realizarTransferencia, isLoading, error, sucesso, setSucesso };
};