package br.uff.ic.mmbank.dto;

import java.math.BigDecimal;

/**
 * DTO representing an incoming Pix receipt from the Central Bank.
 */
public record ExternalReceiptDto(
        String chavePix,
        BigDecimal valor,
        String endToEndId,
        String bancoOrigem,
        String agenciaOrigem,
        String numeroContaOrigem
) {}
