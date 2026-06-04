package br.uff.ic.mmbank.service;

import br.uff.ic.mmbank.dto.TransferenciaRequestDto;
import br.uff.ic.mmbank.dto.TransferenciaResponseDto;
import br.uff.ic.mmbank.factory.TransacaoFactory;
import br.uff.ic.mmbank.mapper.TransferenciaMapper;
import br.uff.ic.mmbank.model.Conta;
import br.uff.ic.mmbank.model.NotaFiscal;
import br.uff.ic.mmbank.model.Transacao;
import br.uff.ic.mmbank.model.Transferencia;
import br.uff.ic.mmbank.model.enums.StatusNotaFiscal;
import br.uff.ic.mmbank.model.enums.TipoTransacao;
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

    @Autowired
    public TransferenciaService(ContaRepository contaRepository,
                                TransferenciaRepository transferenciaRepository,
                                TransacaoFactory transacaoFactory,
                                TransferenciaStrategyResolver strategyResolver,
                                TransferenciaMapper transferenciaMapper,
                                NotaFiscalRepository notaFiscalRepository) {
        this.contaRepository = contaRepository;
        this.transferenciaRepository = transferenciaRepository;
        this.transacaoFactory = transacaoFactory;
        this.strategyResolver = strategyResolver;
        this.transferenciaMapper = transferenciaMapper;
        this.notaFiscalRepository = notaFiscalRepository;
    }

    @Transactional
    public TransferenciaResponseDto realizar(TransferenciaRequestDto dto, TipoTransacao tipo) {
        Conta contaOrigem = contaRepository.findByIdForUpdate(dto.contaOrigemId())
                .orElseThrow(() -> new IllegalArgumentException("Conta de origem não encontrada."));

        Conta contaDestino = contaRepository.findByIdForUpdate(dto.contaDestinoId())
                .orElseThrow(() -> new IllegalArgumentException("Conta de destino não encontrada."));

        TransferenciaStrategy strategy = strategyResolver.getStrategy(tipo);
        strategy.validar(contaOrigem, contaDestino, dto.valor());

        BigDecimal taxa = strategy.calcularTaxa(dto.valor());
        BigDecimal totalDebitoOrigem = dto.valor().add(taxa);

        contaOrigem.setSaldo(contaOrigem.getSaldo().subtract(totalDebitoOrigem));
        contaDestino.setSaldo(contaDestino.getSaldo().add(dto.valor()));

        Transacao debito = transacaoFactory.criarTransacaoSaida(contaOrigem, dto.valor(), tipo);
        Transacao credito = transacaoFactory.criarTransacaoEntrada(contaDestino, dto.valor(), tipo);

        Transferencia transferencia = Transferencia.builder()
                .contaOrigem(contaOrigem)
                .contaDestino(contaDestino)
                .transacoes(List.of(debito, credito))
                .build();

        contaRepository.save(contaOrigem);
        contaRepository.save(contaDestino);
        Transferencia salva = transferenciaRepository.save(transferencia);

        NotaFiscal notaFiscal = new NotaFiscal();
        notaFiscal.setValor(dto.valor());
        notaFiscal.setDataEmissao(LocalDate.now());
        notaFiscal.setConta(contaOrigem);

        notaFiscal.setChaveAcesso(java.util.UUID.randomUUID().toString());
        notaFiscal.setDescricao("Transferência enviada para a conta " + contaDestino.getNumeroConta());

        notaFiscal.setStatus(StatusNotaFiscal.EMITIDO);

        notaFiscalRepository.save(notaFiscal);

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