package br.uff.ic.mmbank.dto.ContaDto;

import br.uff.ic.mmbank.model.enums.TipoConta;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public record ContaRequestDto(
    @NotNull(message = "O ID do cliente é obrigatório")
    Long clienteId,
    @NotNull(message = "O tipo de conta é obrigatório")
    TipoConta tipoConta,
    @NotNull(message = "O saldo inicial é obrigatório")
    @PositiveOrZero(message = "O saldo inicial não pode ser negativo")
    BigDecimal saldoInicial
) {}
