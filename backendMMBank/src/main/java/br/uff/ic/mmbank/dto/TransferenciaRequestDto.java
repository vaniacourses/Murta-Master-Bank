package br.uff.ic.mmbank.dto;

import java.math.BigDecimal;

public record TransferenciaRequestDto(
        Long contaOrigemId,
        Long contaDestinoId,
        BigDecimal valor
) {}