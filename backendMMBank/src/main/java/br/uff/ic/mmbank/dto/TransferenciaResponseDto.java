package br.uff.ic.mmbank.dto;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
public record TransferenciaResponseDto(
        Long id,
        LocalDateTime data,
        BigDecimal valor,
        String numeroContaOrigem,
        String numeroContaDestino
) {}