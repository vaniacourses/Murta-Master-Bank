package br.uff.ic.mmbank.dto.CartaoDto;

import br.uff.ic.mmbank.model.enums.TipoCartao;

public record CartaoRequestDto(
                Long contaId,
                TipoCartao tipo,
                Double limite) {
}
