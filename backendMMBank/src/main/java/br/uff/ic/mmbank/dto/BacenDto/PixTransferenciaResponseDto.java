package br.uff.ic.mmbank.dto.BacenDto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO representing the response of a Pix transfer from the core MMBank domain
 * perspective.
 */
public record PixTransferenciaResponseDto(
        String status,
        String endToEndId,
        String mensagem,
        BigDecimal valor,
        LocalDateTime dataHora) {
}
