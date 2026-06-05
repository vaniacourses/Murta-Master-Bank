package br.uff.ic.mmbank.dto;


import br.uff.ic.mmbank.model.enums.StatusEmprestimo;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;


public record EmprestimoResponseDto(
        Long id,
        BigDecimal valorTotal,
        BigDecimal taxaJuros,
        Integer quantidadeParcelas,
        LocalDate dataInicio,
        StatusEmprestimo status,
        List<ParcelaResponseDto> parcelas
) {
}