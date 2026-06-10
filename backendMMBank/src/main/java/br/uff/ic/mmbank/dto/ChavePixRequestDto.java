package br.uff.ic.mmbank.dto;

import br.uff.ic.mmbank.model.enums.TipoChavePix;

/**
 * Request DTO for creating or updating a Pix key.
 * Note: `contaId` is intentionally omitted — the backend will bind the key
 * to the authenticated user's account.
 */
public record ChavePixRequestDto(
        TipoChavePix tipo,
        String chave
) {}
