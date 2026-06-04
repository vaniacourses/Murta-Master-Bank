import type { TransferenciaRequestDTO, TransferenciaResponseDTO } from '../types/dtos/index';

export const transferenciaService = {
  realizar: async (dados: TransferenciaRequestDTO): Promise<TransferenciaResponseDTO> => {
    // Simulação do backend enquanto a API Spring Boot não está ligada
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (dados.valor <= 0) {
          reject(new Error("O valor deve ser maior que zero."));
          return;
        }
        resolve({
          id: Math.random().toString(36).substring(7),
          dataHora: new Date().toISOString(),
          status: 'CONCLUIDA',
          comprovante: 'TRX-' + Math.floor(Math.random() * 10000)
        });
      }, 1500);
    });

    // Código real futuro:
    // const response = await api.post<TransferenciaResponseDTO>('/transferencias', dados);
    // return response.data;
  }
};