import { api } from './api';

export type StatusEmprestimo = 'ATIVO' | 'QUITADO' | 'ATRASADO';
export type StatusParcela = 'PENDENTE' | 'PAGO' | 'ATRASADO';

interface BackendParcela {
  id: number;
  numero: number;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string | null;
  status: StatusParcela;
}

interface BackendEmprestimo {
  id: number;
  valorTotal: number;
  taxaJuros: number;
  quantidadeParcelas: number;
  dataInicio: string;
  status: StatusEmprestimo;
  parcelas?: BackendParcela[] | null;
}

export interface Parcela {
  id: number;
  numero: number;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string | null;
  status: StatusParcela;
}

export interface Emprestimo {
  id: number;
  valorTotal: number;
  taxaJuros: number;
  qtdParcelas: number;
  valorParcelas: number;
  dataInicio: string;
  status: StatusEmprestimo;
  parcelas: Parcela[];
}

export interface CriarEmprestimoPayload {
  valorTotal: number;
  quantidadeParcelas: number;
  contaId: number;
}

const calcularValorParcelas = (parcelas?: BackendParcela[] | null) => {
  if (!parcelas?.length) {
    return 0;
  }

  return Number(parcelas[0].valor);
};

const mapEmprestimo = (emprestimo: BackendEmprestimo): Emprestimo => ({
  id: emprestimo.id,
  valorTotal: Number(emprestimo.valorTotal),
  taxaJuros: Number(emprestimo.taxaJuros),
  qtdParcelas: emprestimo.quantidadeParcelas,
  valorParcelas: calcularValorParcelas(emprestimo.parcelas),
  dataInicio: emprestimo.dataInicio,
  status: emprestimo.status,
  parcelas: (emprestimo.parcelas ?? []).map((parcela) => ({
    id: parcela.id,
    numero: parcela.numero,
    valor: Number(parcela.valor),
    dataVencimento: parcela.dataVencimento,
    dataPagamento: parcela.dataPagamento ?? null,
    status: parcela.status
  }))
});

export const emprestimoService = {
  async listarPorConta(contaId: number): Promise<Emprestimo[]> {
    const response = await api.get<BackendEmprestimo[]>(`/emprestimos/conta/${contaId}`);
    return response.data.map(mapEmprestimo);
  },

  async criar(payload: CriarEmprestimoPayload): Promise<Emprestimo> {
    const response = await api.post<BackendEmprestimo>('/emprestimos', payload);
    return mapEmprestimo(response.data);
  },

  async pagarParcela(parcelaId: number): Promise<void> {
    await api.patch(`/parcelas/${parcelaId}/pagar`);
  }
};