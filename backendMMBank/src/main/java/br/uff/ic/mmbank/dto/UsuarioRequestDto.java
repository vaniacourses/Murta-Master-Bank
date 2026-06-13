package br.uff.ic.mmbank.dto;

import br.uff.ic.mmbank.model.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UsuarioRequestDto(
        @NotBlank(message = "O nome é obrigatório") String nome,
        @NotBlank(message = "O email é obrigatório") @Email String email,
        @NotBlank(message = "A senha é obrigatória") String senha,
        @NotNull UserRole role,
        String documento,
        LocalDate dataNascimento,
        String telefone,
        String endereco,
        BigDecimal rendaMensal,
        String genero,
        String profissao
){}
