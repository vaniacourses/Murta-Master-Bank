package br.uff.ic.mmbank.dto.ContaDto;

import br.uff.ic.mmbank.model.enums.StatusConta;
import jakarta.validation.constraints.NotNull;

public record AtualizarStatusRequestDto(
        @NotNull(message = "O status é obrigatório")
        StatusConta status
) {}
