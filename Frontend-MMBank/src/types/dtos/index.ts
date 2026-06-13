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
  contaOrigemId: number;
  contaDestinoId: number;
  valor: number;
}

export interface TransferenciaResponseDTO {
  id: number;
  data: string;
  valor: number;
  numeroContaOrigem: string;
  numeroContaDestino: string;
}