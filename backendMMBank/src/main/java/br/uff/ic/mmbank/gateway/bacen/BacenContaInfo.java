package br.uff.ic.mmbank.gateway.bacen;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * External BACEN API model representing the account information associated with a Pix key.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BacenContaInfo {
    private String chave;
    private String tipoChave;
    private String agencia;
    private String numeroConta;
    private String banco;
}
