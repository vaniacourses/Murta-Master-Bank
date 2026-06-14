package br.uff.ic.mmbank.dto;

import br.uff.ic.mmbank.model.Transacao;
import br.uff.ic.mmbank.model.enums.StatusTransacao;
import br.uff.ic.mmbank.model.enums.TipoTransacao;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransacaoDto(
        Long id,
        TipoTransacao tipo,
        BigDecimal valor,
        LocalDateTime data,
        StatusTransacao status,
        String categoria,
        String endToEndId,
        String ispbDestino
) {
    // 🌟 ADICIONE ESSE BLOCO EXATAMENTE ASSIM DENTRO DAS CHAVES DO RECORD:
    public TransacaoDto(Transacao transacao) {
        this(
                transacao.getId(),
                transacao.getTipo(),
                transacao.getValor(),
                transacao.getData(),
                transacao.getStatus(),
                transacao.getCategoria(),
                transacao.getEndToEndId(),
                transacao.getIspbDestino()
        );
    }
}