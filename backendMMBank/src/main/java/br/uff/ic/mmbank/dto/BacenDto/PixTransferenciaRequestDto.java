package br.uff.ic.mmbank.dto.BacenDto;

import java.math.BigDecimal;

/**
 * DTO representing a request to perform a Pix transfer.
 */
public record PixTransferenciaRequestDto(
                Long contaOrigemId,
                String chavePixDestino,
                BigDecimal valor) {
}
