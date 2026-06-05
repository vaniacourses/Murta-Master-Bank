package br.uff.ic.mmbank.dto;

import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.time.LocalDate;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record EmprestimoRequestDto(

        @NotNull(message = "O valor é obrigatório")
        @Positive(message = "O valor deve ser maior que zero")
        BigDecimal valorTotal,

        @NotNull(message = "A quantidade de parcelas é obrigatória")
        @Positive(message = "A quantidade de parcelas deve ser maior que zero")
        Integer quantidadeParcelas,

        Long contaId

) {}