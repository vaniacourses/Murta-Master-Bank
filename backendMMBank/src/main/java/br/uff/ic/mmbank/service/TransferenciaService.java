package br.uff.ic.mmbank.service;

import br.uff.ic.mmbank.dto.BacenDto.PixTransferenciaRequestDto;
import br.uff.ic.mmbank.dto.BacenDto.PixTransferenciaResponseDto;
import br.uff.ic.mmbank.dto.TransferenciaDto.TransferenciaRequestDto;
import br.uff.ic.mmbank.dto.TransferenciaDto.TransferenciaResponseDto;
import br.uff.ic.mmbank.factory.TransacaoFactory;
import br.uff.ic.mmbank.gateway.BacenGateway;
import br.uff.ic.mmbank.mapper.TransferenciaMapper;
import br.uff.ic.mmbank.model.*;
import br.uff.ic.mmbank.model.enums.StatusNotaFiscal;
import br.uff.ic.mmbank.model.enums.TipoTransacao;
import br.uff.ic.mmbank.repository.ChavePixRepository;
import br.uff.ic.mmbank.repository.ContaRepository;
import br.uff.ic.mmbank.repository.NotaFiscalRepository;
import br.uff.ic.mmbank.repository.TransferenciaRepository;
import br.uff.ic.mmbank.strategy.TransferenciaStrategy;
import br.uff.ic.mmbank.strategy.TransferenciaStrategyResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransferenciaService {

    private final ContaRepository contaRepository;
    private final TransferenciaRepository transferenciaRepository;
    private final TransacaoFactory transacaoFactory;
    private final TransferenciaStrategyResolver strategyResolver;
    private final TransferenciaMapper transferenciaMapper;
    private final NotaFiscalRepository notaFiscalRepository;
    private final BacenGateway bacenGateway;
    private final ChavePixRepository chavePixRepository;

    @Autowired
    public TransferenciaService(ContaRepository contaRepository,
                                TransferenciaRepository transferenciaRepository,
                                TransacaoFactory transacaoFactory,
                                TransferenciaStrategyResolver strategyResolver,
                                TransferenciaMapper transferenciaMapper,
                                NotaFiscalRepository notaFiscalRepository,
                                BacenGateway bacenGateway,
                                ChavePixRepository chavePixRepository) {
        this.contaRepository = contaRepository;
        this.transferenciaRepository = transferenciaRepository;
        this.transacaoFactory = transacaoFactory;
        this.strategyResolver = strategyResolver;
        this.transferenciaMapper = transferenciaMapper;
        this.notaFiscalRepository = notaFiscalRepository;
        this.bacenGateway = bacenGateway;
        this.chavePixRepository = chavePixRepository;
    }

    @Transactional
    public TransferenciaResponseDto realizar(TransferenciaRequestDto dto, TipoTransacao tipo) {
        Conta contaOrigem = contaRepository.findByIdForUpdate(dto.contaOrigemId())
                .orElseThrow(() -> new IllegalArgumentException("Conta de origem não encontrada."));

        Conta contaDestino = null;
        boolean isTransferenciaInterna = "MMBank".equalsIgnoreCase(dto.banco());

        if (isTransferenciaInterna) {
            if (tipo == TipoTransacao.PIX_ENVIADO) {
                ChavePix chaveEntidade = chavePixRepository.findByChave(dto.chavePix())
                        .orElseThrow(() -> new IllegalArgumentException("Chave Pix não encontrada no MMBank."));
                contaDestino = chaveEntidade.getConta();
            } else {
                contaDestino = contaRepository.findByNumeroContaForUpdate(dto.conta())
                        .orElseThrow(() -> new IllegalArgumentException("A conta destino número " + dto.conta() + " não existe no MMBank."));
            }
        }

        TransferenciaStrategy strategy = strategyResolver.getStrategy(tipo);
        strategy.validar(contaOrigem, contaDestino, dto.valor());

        BigDecimal taxa = strategy.calcularTaxa(dto.valor());
        BigDecimal totalDebitoOrigem = dto.valor().add(taxa);

        contaOrigem.setSaldo(contaOrigem.getSaldo().subtract(totalDebitoOrigem));
        contaRepository.save(contaOrigem);

        Transacao debito = transacaoFactory.criarTransacaoSaida(contaOrigem, dto.valor(), tipo);
        List<Transacao> transacoesDaTransferencia = new ArrayList<>();
        transacoesDaTransferencia.add(debito);

        if (isTransferenciaInterna) {
            contaDestino.setSaldo(contaDestino.getSaldo().add(dto.valor()));
            contaRepository.save(contaDestino);

            Transacao credito = transacaoFactory.criarTransacaoEntrada(contaDestino, dto.valor(), tipo);
            transacoesDaTransferencia.add(credito);
        }


        Transferencia transferencia = Transferencia.builder()
                .contaOrigem(contaOrigem)
                .contaDestino(contaDestino)
                .transacoes(transacoesDaTransferencia)
                .chavePixUtilizada(dto.chavePix())
                .cpfCnpjFavorecido(dto.cpfCnpj())
                .bancoFavorecido(dto.banco())
                .agenciaFavorecida(dto.agencia())
                .contaFavorecida(dto.conta())
                .tipoEnvio(dto.tipoEnvio())
                .descricao(dto.descricao())
                .build();

        Transferencia salva = transferenciaRepository.save(transferencia);

        NotaFiscal notaFiscal = new NotaFiscal();
        notaFiscal.setValor(dto.valor());
        notaFiscal.setDataEmissao(LocalDate.now());
        notaFiscal.setConta(contaOrigem);
        notaFiscal.setChaveAcesso(java.util.UUID.randomUUID().toString());

        String textoDescricao = (dto.descricao() != null && !dto.descricao().isBlank())
                ? dto.descricao()
                : (isTransferenciaInterna
                ? "Transferência enviada para a conta " + contaDestino.getNumeroConta()
                : "Transferência externa enviada para " + dto.banco());

        notaFiscal.setDescricao(textoDescricao);
        notaFiscal.setStatus(StatusNotaFiscal.EMITIDO);
        notaFiscalRepository.save(notaFiscal);

        if (tipo == TipoTransacao.PIX_ENVIADO) {
            PixTransferenciaRequestDto pixRequest = new PixTransferenciaRequestDto(
                    contaOrigem.getId(),
                    dto.chavePix(),
                    dto.valor()
            );

            PixTransferenciaResponseDto respostaBacen = bacenGateway.enviarOrdemPagamento(pixRequest);

            if (!"LIQUIDADA".equalsIgnoreCase(respostaBacen.status())) {
                throw new IllegalStateException("Transferência rejeitada pelo Bacen: " + respostaBacen.mensagem());
            }
        }

        return transferenciaMapper.toResponseDto(salva, dto.valor());
    }

    @Transactional(readOnly = true)
    public TransferenciaResponseDto buscarPorId(Long id) {
        Transferencia tf = transferenciaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Transferência não encontrada."));
        return transferenciaMapper.toResponseDto(tf);
    }

    @Transactional(readOnly = true)
    public List<TransferenciaResponseDto> listarPorConta(Long contaId) {
        Conta conta = contaRepository.findById(contaId)
                .orElseThrow(() -> new IllegalArgumentException("Conta não encontrada."));

        List<Transferencia> enviadas = transferenciaRepository.findByContaOrigem(conta);
        List<Transferencia> recebidas = transferenciaRepository.findByContaDestino(conta);

        enviadas.addAll(recebidas);

        return enviadas.stream()
                .distinct()
                .map(transferenciaMapper::toResponseDto)
                .collect(Collectors.toList());
    }
}