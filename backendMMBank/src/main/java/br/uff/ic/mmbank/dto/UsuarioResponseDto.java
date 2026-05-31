package br.uff.ic.mmbank.dto;

import br.uff.ic.mmbank.model.enums.UserRole;

public record UsuarioResponseDto(
        Long id,
        String nome,
        String email,
        UserRole role
) {}