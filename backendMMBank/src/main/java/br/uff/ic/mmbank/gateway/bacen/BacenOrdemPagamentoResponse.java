package br.uff.ic.mmbank.gateway.bacen;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * External BACEN API model representing the response of the Pix payment order execution.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BacenOrdemPagamentoResponse {
    private String status;
    private String endToEndId;
    private String mensagem;
}
