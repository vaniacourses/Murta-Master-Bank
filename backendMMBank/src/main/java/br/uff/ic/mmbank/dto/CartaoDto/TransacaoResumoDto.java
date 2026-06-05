package br.uff.ic.mmbank.dto.CartaoDto;

import br.uff.ic.mmbank.model.enums.StatusTransacao;
import br.uff.ic.mmbank.model.enums.TipoTransacao;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO resumido de uma transação, usado na resposta de fatura e transações
 * recentes.
 * Evita expor a entidade JPA diretamente.
 *
 * @param id        ID da transação.
 * @param valor     Valor monetário da transação.
 * @param data      Data e hora da transação.
 * @param tipo      Tipo da transação (PIX, COMPRA_CREDITO, etc.).
 * @param categoria Categoria da transação (ex: alimentação, transporte).
 * @param status    Status da transação (PENDENTE, CONCLUIDA, RECUSADA).
 */
public record TransacaoResumoDto(
                Long id,
                BigDecimal valor,
                LocalDateTime data,
                TipoTransacao tipo,
                String categoria,
                StatusTransacao status) {
}
