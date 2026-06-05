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

/**
 * <h1>Padrão de Projeto GoF: Adapter</h1>
 * <p>
 * A classe {@code BacenAdapter} atua como um Adaptador (Adapter) entre o núcleo
 * do sistema MMBank
 * (que utiliza a interface {@link BacenGateway} e os DTOs de domínio como
 * {@link PixTransferenciaRequestDto})
 * e a API externa do Banco Central simulada por {@link BacenSimulator} (o
 * Adaptee).
 * </p>
 *
 * <h2>Como o Adapter protege o núcleo do MMBank:</h2>
 * <ul>
 * <li><b>Isolamento de Contratos Externos:</b> O núcleo do MMBank (camada de
 * serviços, controladores e entidades)
 * não conhece a estrutura de dados proprietária do BACEN (ex:
 * {@link BacenOrdemPagamentoRequest}, {@link BacenOrdemPagamentoResponse}).
 * Ele interage exclusivamente por meio de abstrações locais e tipos nativos de
 * domínio.</li>
 * <li><b>Resiliência a Mudanças na API:</b> Se o BACEN alterar o formato de sua
 * API, alterar nomes de campos (ex: mudar
 * {@code chaveDestino} para {@code pixKeyDest}), alterar o protocolo de
 * comunicação (ex: de REST/JSON para XML/gRPC)
 * ou adicionar novos parâmetros obrigatórios na requisição, <b>apenas</b> este
 * adaptador precisará ser modificado.
 * Nenhuma linha de código das regras de negócios de transferências ou da lógica
 * de Pix do MMBank precisará ser alterada.</li>
 * <li><b>Facilidade de Testabilidade:</b> Permite substituir a integração real
 * por mocks da interface {@link BacenGateway}
 * com facilidade nos testes unitários da camada de serviço de negócio.</li>
 * </ul>
 *
 * <p>
 * Este adaptador também reflete a lógica do <b>Caso de Uso UC05 (Liquidação de
 * Pix no BACEN)</b>, onde o sistema do banco
 * prepara a ordem de pagamento com base nos dados locais do cliente e envia ao
 * BACEN para processamento síncrono.
 * </p>
 */
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

        // Obtém a instância do Singleton
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
