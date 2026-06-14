package br.uff.ic.mmbank.dto.TransferenciaDto;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
public record TransferenciaResponseDto(
        Long id,
        LocalDateTime data,
        BigDecimal valor,
        String numeroContaOrigem,
        String numeroContaDestino,
        String chavePixUtilizada,
        String cpfCnpjFavorecido,
        String bancoFavorecido,
        String agenciaFavorecida,
        String contaFavorecida,
        String nomeFavorecido
) {}