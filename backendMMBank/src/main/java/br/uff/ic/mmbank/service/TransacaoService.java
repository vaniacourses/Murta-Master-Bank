package br.uff.ic.mmbank.service;

import br.uff.ic.mmbank.model.Conta;
import br.uff.ic.mmbank.model.Transacao;
import br.uff.ic.mmbank.model.enums.StatusTransacao;
import br.uff.ic.mmbank.model.enums.TipoTransacao;
import br.uff.ic.mmbank.repository.ContaRepository;
import br.uff.ic.mmbank.repository.TransacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class TransacaoService {

    private final TransacaoRepository transacaoRepository;
    private final ContaRepository contaRepository;

    @Autowired
    public TransacaoService(TransacaoRepository transacaoRepository, ContaRepository contaRepository) {
        this.transacaoRepository = transacaoRepository;
        this.contaRepository = contaRepository;
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public Transacao registrarCredito(Conta conta, BigDecimal valor, TipoTransacao tipo, String endToEndId,
            String bancoOrigem) {
        // RNF02: The client balance is altered only through registered transactions
        conta.setSaldo(conta.getSaldo().add(valor));
        contaRepository.save(conta);

        // RNF03: The transaction must include a timestamp, amount, and transaction type
        Transacao transacao = Transacao.builder()
                .conta(conta)
                .valor(valor)
                .tipo(tipo)
                .data(LocalDateTime.now()) // timestamp (RNF03)
                .status(StatusTransacao.CONCLUIDA)
                .categoria("Pix Recebido")
                .endToEndId(endToEndId)
                .ispbDestino(bancoOrigem)
                .build();

        return transacaoRepository.save(transacao);
    }
}
