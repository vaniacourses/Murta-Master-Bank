package br.uff.ic.mmbank.dto.CartaoDto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO de resposta para o cálculo da fatura de um cartão de crédito.
 *
 * @param valorTotal     Soma de todas as transações de crédito no período
 *                       apurado.
 * @param dataVencimento Data de vencimento da fatura (dia de pagamento do
 *                       cartão).
 * @param statusFatura   "ABERTA" se a data atual for antes do fechamento,
 *                       "FECHADA" caso contrário.
 * @param transacoes     Lista detalhada das transações incluídas na fatura.
 */
public record FaturaResponseDto(
                BigDecimal valorTotal,
                LocalDate dataVencimento,
                String statusFatura,
                List<TransacaoResumoDto> transacoes) {
}
