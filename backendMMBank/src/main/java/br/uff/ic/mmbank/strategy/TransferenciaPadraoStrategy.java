package br.uff.ic.mmbank.strategy;

import br.uff.ic.mmbank.model.Conta;
import br.uff.ic.mmbank.model.enums.StatusConta;
import br.uff.ic.mmbank.model.enums.TipoTransacao;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDateTime;

@Component
public class TransferenciaPadraoStrategy implements TransferenciaStrategy {

    @Override
    public TipoTransacao getTipo() {
        return TipoTransacao.TRANSFERENCIA;
    }

    @Override
    public void validar(Conta origem, Conta destino, BigDecimal valor) {
        if (valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("O valor da transferência deve ser maior que zero.");
        }
        if (destino != null) {
            if (origem.getId().equals(destino.getId())) {
                throw new IllegalArgumentException("Não é possível transferir para a mesma conta.");
            }
            if (destino.getStatusConta() != StatusConta.ATIVA) {
                throw new IllegalArgumentException("A conta de destino precisa estar ATIVA para a transação.");
            }
        }

        if (origem.getStatusConta() != StatusConta.ATIVA) {
            throw new IllegalArgumentException("A conta de origem precisa estar ATIVA para a transação.");
        }

        // Horário comercial do TED
        LocalDateTime agora = LocalDateTime.now();
        DayOfWeek dia = agora.getDayOfWeek();
        int hora = agora.getHour();

        if (dia == DayOfWeek.SATURDAY || dia == DayOfWeek.SUNDAY || hora < 8 || hora >= 17) {
            throw new IllegalArgumentException("Transferências padrão só ocorrem em dias úteis, das 08h às 17h.");
        }

        BigDecimal taxa = calcularTaxa(valor);
        BigDecimal totalASerDescontado = valor.add(taxa);

        if (origem.getSaldo().compareTo(totalASerDescontado) < 0) {
            throw new IllegalArgumentException("Saldo insuficiente. É necessário cobrir o valor e a taxa de R$ " + taxa);
        }
    }

    @Override
    public BigDecimal calcularTaxa(BigDecimal valor) {
        // Taxa fixa
        return new BigDecimal("5.00");
    }
}