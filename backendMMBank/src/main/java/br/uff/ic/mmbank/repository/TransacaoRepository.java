package br.uff.ic.mmbank.repository;

import br.uff.ic.mmbank.model.Conta;
import br.uff.ic.mmbank.model.Transacao;
import br.uff.ic.mmbank.model.enums.TipoTransacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, Long> {
    List<Transacao> findByConta(Conta conta);

    Page<Transacao> findByContaIdOrderByDataDesc(Long contaId, Pageable pageable);
    List<Transacao> findByContaIdOrderByDataDesc(Long contaId);

    List<Transacao> findByContaAndTipo(Conta conta, TipoTransacao tipo);

    List<Transacao> findByDataBetween(LocalDateTime dataInicio, LocalDateTime dataFim);

    @Query("SELECT t FROM Transacao t WHERE t.cartao.id = :cartaoId " +
            "AND t.tipo = :tipo " +
            "AND t.data >= :dataInicio AND t.data <= :dataFim " +
            "ORDER BY t.data ASC")
    List<Transacao> findByCartaoIdAndTipoAndDataBetween(
            @Param("cartaoId") Long cartaoId,
            @Param("tipo") TipoTransacao tipo,
            @Param("dataInicio") LocalDateTime dataInicio,
            @Param("dataFim") LocalDateTime dataFim);

    @Query("SELECT t FROM Transacao t WHERE t.cartao.id = :cartaoId ORDER BY t.data DESC")
    Page<Transacao> findRecentByCartaoId(@Param("cartaoId") Long cartaoId, Pageable pageable);

    @Query("SELECT COALESCE(SUM(ABS(t.valor)), 0) FROM Transacao t " +
            "WHERE t.conta.id = :contaId " +
            "AND t.status = 'CONCLUIDA' " +
            "AND (t.tipo = br.uff.ic.mmbank.model.enums.TipoTransacao.DEPOSITO " +
            "OR t.tipo = br.uff.ic.mmbank.model.enums.TipoTransacao.PIX_RECEBIDO " +
            "OR (t.tipo = br.uff.ic.mmbank.model.enums.TipoTransacao.TRANSFERENCIA AND t.valor > 0))")
    BigDecimal calcularTotalEntradas(@Param("contaId") Long contaId);

    @Query("SELECT COALESCE(SUM(ABS(t.valor)), 0) FROM Transacao t " +
            "WHERE t.conta.id = :contaId " +
            "AND t.status = 'CONCLUIDA' " +
            "AND (t.tipo = br.uff.ic.mmbank.model.enums.TipoTransacao.PIX_ENVIADO " +
            "OR t.tipo = br.uff.ic.mmbank.model.enums.TipoTransacao.SAQUE " +
            "OR t.tipo = br.uff.ic.mmbank.model.enums.TipoTransacao.PAGAMENTO_EMPRESTIMO " +
            "OR t.tipo = br.uff.ic.mmbank.model.enums.TipoTransacao.COMPRA_DEBITO " +
            "OR t.tipo = br.uff.ic.mmbank.model.enums.TipoTransacao.COMPRA_CREDITO " +
            "OR (t.tipo = br.uff.ic.mmbank.model.enums.TipoTransacao.TRANSFERENCIA AND t.valor < 0))")
    BigDecimal calcularTotalSaidas(@Param("contaId") Long contaId);
}
