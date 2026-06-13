package br.uff.ic.mmbank.strategy;

import br.uff.ic.mmbank.model.Conta;
import br.uff.ic.mmbank.model.enums.StatusConta;
import br.uff.ic.mmbank.model.enums.TipoTransacao;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class PixStrategy implements TransferenciaStrategy {

    @Override
    public TipoTransacao getTipo() {
        return TipoTransacao.PIX_ENVIADO;
    }

    @Override
    public void validar(Conta origem, Conta destino, BigDecimal valor) {
        if (valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("O valor do PIX deve ser maior que zero.");
        }
        if (destino != null) {
            if (origem.getId().equals(destino.getId())) {
                throw new IllegalArgumentException("Não é possível fazer um PIX para a mesma conta.");
            }
            if (destino.getStatusConta() != StatusConta.ATIVA) {
                throw new IllegalArgumentException("A conta de destino precisa estar ATIVA.");
            }
        }

        // Limite de pix noturno
        int horaAtual = LocalDateTime.now().getHour();
        boolean isNoturno = (horaAtual >= 20 || horaAtual < 6);
        if (isNoturno && valor.compareTo(new BigDecimal("1000.00")) > 0) {
            throw new IllegalArgumentException("O limite para PIX noturno é de R$ 1.000,00.");
        }

        if (origem.getSaldo().compareTo(valor) < 0) {
            throw new IllegalArgumentException("Saldo insuficiente para realizar o PIX.");
        }
    }

    @Override
    public BigDecimal calcularTaxa(BigDecimal valor) {
        return BigDecimal.ZERO; // Pessoa física não tem taxa
    }
}