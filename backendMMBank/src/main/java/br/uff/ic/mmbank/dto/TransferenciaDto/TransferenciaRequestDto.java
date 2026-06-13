package br.uff.ic.mmbank.dto.TransferenciaDto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransferenciaRequestDto(
        Long contaOrigemId,
        Long contaDestinoId,
        BigDecimal valor,

        String chavePix,
        String cpfCnpj,
        String banco,
        String agencia,
        String conta,
        String tipoEnvio,
        LocalDate dataPagamento,
        String descricao
) {}