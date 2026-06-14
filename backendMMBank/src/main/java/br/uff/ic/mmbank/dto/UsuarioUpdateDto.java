package br.uff.ic.mmbank.dto;

import java.math.BigDecimal;

public record UsuarioUpdateDto(
        String nome,
        String telefone,
        String endereco,
        BigDecimal rendaMensal,
        String profissao
) {}