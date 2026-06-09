import { api } from './api';
import type { TransferenciaRequestDTO, TransferenciaResponseDTO } from '../types/dtos/index';

export const transferenciaService = {
  
  // rota de PIX
  realizarPix: async (dados: TransferenciaRequestDTO): Promise<TransferenciaResponseDTO> => {
    const response = await api.post<TransferenciaResponseDTO>('/transferencias/pix', dados);
    return response.data;
  },

  // rota de transferencia padrão (TED)
  realizar: async (dados: TransferenciaRequestDTO): Promise<TransferenciaResponseDTO> => {
    const response = await api.post<TransferenciaResponseDTO>('/transferencias', dados);
    return response.data;
  }
  
};