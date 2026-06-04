package br.uff.ic.mmbank.strategy;

import br.uff.ic.mmbank.model.Conta;
import br.uff.ic.mmbank.model.enums.TipoTransacao;
import java.math.BigDecimal;

public interface TransferenciaStrategy {
    TipoTransacao getTipo();

    void validar(Conta origem, Conta destino, BigDecimal valor);

    BigDecimal calcularTaxa(BigDecimal valor);
}