package br.uff.ic.mmbank.gateway;

import br.uff.ic.mmbank.dto.BacenDto.PixConsultaChaveResponseDto;
import br.uff.ic.mmbank.dto.BacenDto.PixTransferenciaRequestDto;
import br.uff.ic.mmbank.dto.BacenDto.PixTransferenciaResponseDto;
import br.uff.ic.mmbank.gateway.bacen.*;
import br.uff.ic.mmbank.model.Conta;
import br.uff.ic.mmbank.repository.ContaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;


@Service
public class BacenAdapter implements BacenGateway {

    private final ContaRepository contaRepository;

    @Autowired
    public BacenAdapter(ContaRepository contaRepository) {
        this.contaRepository = contaRepository;
    }

    @Override
    public PixConsultaChaveResponseDto consultarChave(String chave) {
        // Obtém a única instância em memória do BacenSimulator (Singleton)
        BacenSimulator simulator = BacenSimulator.getInstance();

        // Envia a consulta à API externa simulada do Bacen
        BacenConsultaChaveResponse externalResponse = simulator.consultarChave(chave);

        // Adapta o retorno externo para o DTO de domínio do MMBank
        return new PixConsultaChaveResponseDto(
                externalResponse.isEncontrada(),
                externalResponse.getChave(),
                externalResponse.getTipoChave(),
                externalResponse.getAgencia(),
                externalResponse.getNumeroConta(),
                externalResponse.getBanco());
    }

    @Override
    public PixTransferenciaResponseDto enviarOrdemPagamento(PixTransferenciaRequestDto request) {
        // Recupera a conta de origem no MMBank para preencher os dados de envio
        // exigidos pela API do BACEN
        Conta contaOrigem = contaRepository.findById(request.contaOrigemId())
                .orElseThrow(() -> new IllegalArgumentException("Conta de origem não encontrada."));

        // Adapta os DTOs e entidades de domínio do MMBank para o formato exigido pelo
        // BacenSimulator (Adaptee)
        BacenOrdemPagamentoRequest externalRequest = BacenOrdemPagamentoRequest.builder()
                .chaveDestino(request.chavePixDestino())
                .agenciaOrigem("0001") // MMBank agência única
                .numeroContaOrigem(contaOrigem.getNumeroConta())
                .bancoOrigem("MMBank")
                .valor(request.valor())
                .build();

        BacenSimulator simulator = BacenSimulator.getInstance();

        // Executa a chamada síncrona ao BacenSimulator (Adaptee)
        BacenOrdemPagamentoResponse externalResponse = simulator.processarOrdemPagamento(externalRequest);

        // Traduz/Adapta o retorno da API do Bacen de volta para o DTO de domínio do
        // MMBank
        return new PixTransferenciaResponseDto(
                externalResponse.getStatus(),
                externalResponse.getEndToEndId(),
                externalResponse.getMensagem(),
                request.valor(),
                LocalDateTime.now());
    }
}
