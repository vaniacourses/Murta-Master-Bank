package br.uff.ic.mmbank.dto;

import br.uff.ic.mmbank.model.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UsuarioRequestDto(
        @NotBlank(message = "O nome é obrigatório") String nome,
        @NotBlank(message = "O email é obrigatório") @Email String email,
        @NotBlank(message = "A senha é obrigatória") String senha,
        UserRole role
){}
