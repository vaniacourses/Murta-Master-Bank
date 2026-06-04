package br.uff.ic.mmbank.factory;

import br.uff.ic.mmbank.model.Conta;
import br.uff.ic.mmbank.model.Transacao;
import br.uff.ic.mmbank.model.enums.StatusTransacao;
import br.uff.ic.mmbank.model.enums.TipoTransacao;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class TransacaoFactory {
    public Transacao criarTransacaoSaida(Conta origem, BigDecimal valor, TipoTransacao tipo) {
        return Transacao.builder()
                .conta(origem)
                // Usamos negate() para salvar no banco como um valor negativo (ex: -50.00)
                .valor(valor.negate())
                .tipo(tipo)
                .data(LocalDateTime.now())
                .status(StatusTransacao.CONCLUIDA)
                .categoria("Transferência Enviada")
                .build();
    }

    public Transacao criarTransacaoEntrada(Conta destino, BigDecimal valor, TipoTransacao tipo) {
        return Transacao.builder()
                .conta(destino)
                .valor(valor)
                .tipo(tipo)
                .data(LocalDateTime.now())
                .status(StatusTransacao.CONCLUIDA)
                .categoria("Transferência Recebida")
                .build();
    }
}