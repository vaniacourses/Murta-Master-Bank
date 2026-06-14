package br.uff.ic.mmbank.service;

import br.uff.ic.mmbank.dto.ExternalReceiptDto;
import br.uff.ic.mmbank.dto.BacenDto.PixConsultaChaveResponseDto;
import br.uff.ic.mmbank.gateway.BacenGateway;
import br.uff.ic.mmbank.model.Conta;
import br.uff.ic.mmbank.model.enums.TipoTransacao;
import br.uff.ic.mmbank.repository.ContaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class PixService {

    private final BacenGateway bacenGateway;
    private final ContaRepository contaRepository;
    private final TransacaoService transacaoService;

    @Autowired
    public PixService(BacenGateway bacenGateway, ContaRepository contaRepository, TransacaoService transacaoService) {
        this.bacenGateway = bacenGateway;
        this.contaRepository = contaRepository;
        this.transacaoService = transacaoService;
    }

    @Transactional
    public void receberPixExterno(ExternalReceiptDto dto) {
        if (dto.chavePix() == null || dto.chavePix().isBlank()) {
            throw new IllegalArgumentException("Chave Pix de destino não informada.");
        }
        if (dto.valor() == null || dto.valor().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor do Pix deve ser maior que zero.");
        }

        PixConsultaChaveResponseDto consulta = bacenGateway.consultarChave(dto.chavePix());
        if (!consulta.encontrada()) {
            throw new IllegalArgumentException("Chave Pix não encontrada no BACEN.");
        }
        if (!"MMBank".equalsIgnoreCase(consulta.banco())) {
            throw new IllegalArgumentException("Chave Pix não pertence a um cliente do MMBank: " + consulta.banco());
        }

        Conta contaDestino = contaRepository.findByNumeroContaForUpdate(consulta.numeroConta())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Conta destino não encontrada no MMBank: " + consulta.numeroConta()));

        contaDestino.setSaldo(contaDestino.getSaldo().add(dto.valor()));
        contaRepository.save(contaDestino);

        transacaoService.registrarCredito(
                contaDestino,
                dto.valor(),
                TipoTransacao.PIX_RECEBIDO,
                dto.endToEndId(),
                dto.bancoOrigem());
    }
}
