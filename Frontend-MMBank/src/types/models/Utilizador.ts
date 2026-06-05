export interface Usuario {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  tipo: 'PF' | 'PJ';
}

export interface AuthResponseDTO {
  token: string;
  usuario: Usuario;
}