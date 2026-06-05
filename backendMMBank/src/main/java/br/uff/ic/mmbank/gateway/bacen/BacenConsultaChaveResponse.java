package br.uff.ic.mmbank.gateway.bacen;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * External BACEN API model representing the response for a Pix key query.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BacenConsultaChaveResponse {
    private boolean encontrada;
    private String chave;
    private String tipoChave;
    private String agencia;
    private String numeroConta;
    private String banco;
}
