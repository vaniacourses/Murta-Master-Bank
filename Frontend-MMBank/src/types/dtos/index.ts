// Baseado no pacote DTO do seu diagrama de classes

export interface AutenticacaoRequestDTO {
  email: string;
  senha: string;
}

export interface LoginResponseDTO {
  token: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    tipo: 'PF' | 'PJ';
  };
}

export interface TransferenciaRequestDTO {
  contaDestino: string;
  agenciaDestino: string;
  valor: number;
}

export interface TransferenciaResponseDTO {
  id: string;
  dataHora: string;
  status: 'CONCLUIDA' | 'FALHA' | 'PENDENTE';
  comprovante: string;
}