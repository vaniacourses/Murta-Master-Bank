package br.uff.ic.mmbank.dto;

import br.uff.ic.mmbank.model.enums.StatusParcela;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ParcelaResponseDto(
        Long id,
        Integer numero,
        BigDecimal valor,
        LocalDate dataVencimento,
        LocalDate dataPagamento,
        StatusParcela status
) {
}