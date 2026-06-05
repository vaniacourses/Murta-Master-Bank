package br.uff.ic.mmbank.dto.CartaoDto;

import java.time.LocalDate;
import java.util.List;

import br.uff.ic.mmbank.model.enums.TipoCartao;
import lombok.Builder;
import br.uff.ic.mmbank.model.enums.StatusCartao;
import br.uff.ic.mmbank.model.Transacao;

@Builder
public record CartaoResponseDto(
                Long id,
                Long contaId,
                TipoCartao tipo,
                Double limite,
                String numeroCartao,
                String cvv,
                LocalDate dataValidade,
                LocalDate dataEmissao,
                StatusCartao status,
                List<Transacao> transacoes,
                int diaFechamento,
                int diaPagamento) {
}
