package br.uff.ic.mmbank.dto;

import br.uff.ic.mmbank.model.enums.TipoChavePix;

import java.time.LocalDateTime;

public record ChavePixResponseDto(
        Long id,
        TipoChavePix tipo,
        String chave,
        Long contaId,
        LocalDateTime dataCriacao
) {
    public static ChavePixResponseDto fromEntity(br.uff.ic.mmbank.model.ChavePix e) {
        return new ChavePixResponseDto(
                e.getId(),
                e.getTipo(),
                e.getChave(),
                e.getConta() != null ? e.getConta().getId() : null,
                e.getDataCriacao()
        );
    }
}
