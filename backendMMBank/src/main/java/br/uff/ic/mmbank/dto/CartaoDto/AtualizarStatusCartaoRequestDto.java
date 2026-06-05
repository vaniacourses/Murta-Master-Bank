package br.uff.ic.mmbank.dto.CartaoDto;

import br.uff.ic.mmbank.model.enums.StatusCartao;
import jakarta.validation.constraints.NotNull;

/**
 * DTO de requisição para atualização do status de um cartão.
 *
 * @param status Novo status do cartão (ATIVO, BLOQUEADO ou CANCELADO).
 */
public record AtualizarStatusCartaoRequestDto(

                @NotNull(message = "O status do cartão é obrigatório (ATIVO, BLOQUEADO ou CANCELADO).") StatusCartao status) {
}
