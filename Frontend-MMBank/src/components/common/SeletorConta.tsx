import { useState, useEffect } from "react";
import { api } from "../../service/api";

export interface ContaResponseDto {
  id: number;
  numeroConta: string;
  saldo: number;
  tipoConta: "CORRENTE" | "POUPANCA";
  statusConta: "ATIVA" | "INATIVA";
  clienteId: number;
  nomeCliente: string;
}

interface SeletorContaProps {
  contaAtiva: ContaResponseDto | null;
  onSelecionarConta: (conta: ContaResponseDto) => void;
  clienteId: number; // Passado dinamicamente para a busca real
}

export function SeletorConta({
  contaAtiva,
  onSelecionarConta,
  clienteId,
}: SeletorContaProps) {
  const [contas, setContas] = useState<ContaResponseDto[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Busca as contas reais baseadas no cliente logado
  useEffect(() => {
    async function carregarContas() {
      try {
        // Envia o clienteId como query param para o back-end refatorado
        const response = await api.get(`/contas/cliente/${clienteId}`);

        const dadosContas = response.data;
        setContas(dadosContas);

        // Se nenhuma conta foi definida como ativa ainda, define a primeira encontrada
        if (dadosContas.length > 0 && !contaAtiva) {
          onSelecionarConta(dadosContas[0]);
        }
      } catch (error) {
        console.error("Erro ao buscar contas do backend:", error);
      }
    }

    if (clienteId) {
      carregarContas();
    }
  }, [clienteId, contaAtiva, onSelecionarConta]);

  // Filtra para remover a conta atualmente selecionada da lista de opções
  const contasDisponiveisParaAlternar = contas.filter(
    (c) => c.numeroConta !== contaAtiva?.numeroConta,
  );

  return (
    <div style={{ position: "relative", display: "inline-block", zIndex: 50 }}>
      {/* Botão Retangular e Compacto */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          backgroundColor: "#111827", // bg-gray-900
          color: "#f3f4f6", // text-gray-100
          padding: "6px 14px",
          borderRadius: "6px",
          border: "1px solid #1f2937", // border-gray-800
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: 500,
          minWidth: "200px",
          height: "38px",
          transition: "all 0.2s",
        }}
      >
        <span>
          {contaAtiva
            ? `${contaAtiva.tipoConta === "CORRENTE" ? "CC" : "Poupança"}: ${contaAtiva.numeroConta}`
            : "Carregando..."}
        </span>

        {/* Ícone de Seta Minimalista */}
        <svg
          style={{
            width: "14px",
            height: "14px",
            color: "#9ca3af",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown de Opções */}
      {isOpen && (
        <>
          {/* Overlay para fechar ao clicar fora */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 40,
            }}
            onClick={() => setIsOpen(false)}
          />

          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              marginTop: "4px",
              width: "100%",
              backgroundColor: "#030712", // bg-gray-950
              border: "1px solid #1f2937",
              borderRadius: "6px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
              zIndex: 50,
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "4px 0" }}>
              <p
                style={{
                  padding: "4px 12px",
                  margin: 0,
                  fontSize: "10px",
                  color: "#6b7280",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Alternar para:
              </p>

              {contasDisponiveisParaAlternar.length === 0 ? (
                <p
                  style={{
                    padding: "8px 12px",
                    margin: 0,
                    fontSize: "12px",
                    color: "#4b5563",
                    fontStyle: "italic",
                  }}
                >
                  Nenhuma outra conta
                </p>
              ) : (
                contasDisponiveisParaAlternar.map((conta) => (
                  <button
                    key={conta.id}
                    onClick={() => {
                      onSelecionarConta(conta);
                      setIsOpen(false);
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 12px",
                      fontSize: "12px",
                      backgroundColor: "transparent",
                      border: "none",
                      color: "#d1d5db",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      transition: "background-color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#1f2937")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <span style={{ fontWeight: 600 }}>
                      {conta.tipoConta === "CORRENTE"
                        ? "Conta Corrente"
                        : "Conta Poupança"}
                    </span>
                    <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                      C/C: {conta.numeroConta}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
