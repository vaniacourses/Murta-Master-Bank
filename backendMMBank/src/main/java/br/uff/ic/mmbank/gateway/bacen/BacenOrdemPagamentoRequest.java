package br.uff.ic.mmbank.gateway.bacen;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

/**
 * External BACEN API model representing the Pix payment order request.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BacenOrdemPagamentoRequest {
    private String chaveDestino;
    private String agenciaOrigem;
    private String numeroContaOrigem;
    private String bancoOrigem;
    private BigDecimal valor;
}
