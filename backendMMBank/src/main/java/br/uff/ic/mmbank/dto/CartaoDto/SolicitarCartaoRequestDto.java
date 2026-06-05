package br.uff.ic.mmbank.dto.CartaoDto;

import br.uff.ic.mmbank.model.enums.TipoCartao;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

/**
 * DTO de requisição para solicitação de um novo cartão.
 *
 * @param contaId           ID da conta à qual o cartão será vinculado.
 * @param tipo              Tipo do cartão (CREDITO ou DEBITO).
 * @param senhaTransacional Senha de 4 a 6 dígitos numéricos, validada mas não
 *                          persistida.
 */
public record SolicitarCartaoRequestDto(

                @NotNull(message = "O ID da conta é obrigatório.") Long contaId,

                @NotNull(message = "O tipo do cartão é obrigatório (CREDITO ou DEBITO).") TipoCartao tipo,

                @NotNull(message = "A senha transacional é obrigatória.") @Pattern(regexp = "^\\d{4,6}$", message = "A senha transacional deve conter entre 4 e 6 dígitos numéricos.") String senhaTransacional) {
}
