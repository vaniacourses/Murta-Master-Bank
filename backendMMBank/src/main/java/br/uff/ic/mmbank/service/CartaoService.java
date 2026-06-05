package br.uff.ic.mmbank.service;

import br.uff.ic.mmbank.dto.*;
import br.uff.ic.mmbank.dto.CartaoDto.CartaoResponseDto;
import br.uff.ic.mmbank.dto.CartaoDto.FaturaResponseDto;
import br.uff.ic.mmbank.dto.CartaoDto.SolicitarCartaoRequestDto;
import br.uff.ic.mmbank.dto.CartaoDto.TransacaoResumoDto;
import br.uff.ic.mmbank.exception.BusinessException;
import br.uff.ic.mmbank.exception.ResourceNotFoundException;
import br.uff.ic.mmbank.mapper.CartaoMapper;
import br.uff.ic.mmbank.model.Cartao;
import br.uff.ic.mmbank.model.Conta;
import br.uff.ic.mmbank.model.Transacao;
import br.uff.ic.mmbank.model.enums.StatusCartao;
import br.uff.ic.mmbank.model.enums.TipoCartao;
import br.uff.ic.mmbank.model.enums.TipoTransacao;
import br.uff.ic.mmbank.repository.CartaoRepository;
import br.uff.ic.mmbank.repository.ContaRepository;
import br.uff.ic.mmbank.repository.TransacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartaoService {

    private final CartaoRepository cartaoRepository;
    private final ContaRepository contaRepository;
    private final TransacaoRepository transacaoRepository;
    private final CartaoMapper cartaoMapper;

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private static final BigDecimal LIMITE_CREDITO_INICIAL = new BigDecimal("5000.00");

    @Transactional(readOnly = true)
    public CartaoResponseDto buscarPorId(Long id) {
        Cartao cartao = findCartaoOrThrow(id);
        return cartaoMapper.toCartaoResponseDto(cartao);
    }

    @Transactional(readOnly = true)
    public List<CartaoResponseDto> listarPorConta(Long contaId) {
        validarContaExistente(contaId);
        List<Cartao> cartoes = cartaoRepository.findByContaId(contaId);
        return cartaoMapper.toCartaoResponseDtoList(cartoes);
    }

    @Transactional
    public CartaoResponseDto atualizarStatus(Long id, StatusCartao novoStatus) {
        Cartao cartao = findCartaoOrThrow(id);

        if (cartao.getStatus() == StatusCartao.CANCELADO) {
            throw new BusinessException("Não é possível alterar o status de um cartão cancelado.");
        }

        cartao.setStatus(novoStatus);
        Cartao salvo = cartaoRepository.save(cartao);
        return cartaoMapper.toCartaoResponseDto(salvo);
    }

    @Transactional
    public CartaoResponseDto cancelar(Long id) {
        Cartao cartao = findCartaoOrThrow(id);
        cartao.setStatus(StatusCartao.CANCELADO);
        Cartao salvo = cartaoRepository.save(cartao);
        return cartaoMapper.toCartaoResponseDto(salvo);
    }

    @Transactional
    public CartaoResponseDto solicitarCartao(SolicitarCartaoRequestDto dto) {
        Conta conta = contaRepository.findById(dto.contaId())
                .orElseThrow(() -> new ResourceNotFoundException("Conta", dto.contaId()));

        String numeroCartao = gerarNumeroCartaoUnico();
        String cvv = gerarCvv();
        LocalDate dataEmissao = LocalDate.now();
        LocalDate dataValidade = dataEmissao.plusYears(5);

        Cartao cartao = Cartao.builder()
                .conta(conta)
                .tipo(dto.tipo())
                .numeroCartao(numeroCartao)
                .cvv(cvv)
                .dataEmissao(dataEmissao)
                .dataValidade(dataValidade)
                .status(StatusCartao.ATIVO)
                .build();

        if (dto.tipo() == TipoCartao.CREDITO) {
            cartao.setLimite(LIMITE_CREDITO_INICIAL);
            cartao.setDiaFechamento(25);
            cartao.setDiaPagamento(5);
        } else {
            cartao.setLimite(BigDecimal.ZERO);
            cartao.setDiaFechamento(0);
            cartao.setDiaPagamento(0);
        }

        Cartao salvo = cartaoRepository.save(cartao);
        return cartaoMapper.toCartaoResponseDto(salvo);
    }

    @Transactional(readOnly = true)
    public FaturaResponseDto calcularFatura(Long cartaoId, Integer mes, Integer ano) {
        Cartao cartao = findCartaoOrThrow(cartaoId);

        if (cartao.getTipo() != TipoCartao.CREDITO) {
            throw new BusinessException("Não é possível calcular fatura para cartões de débito.");
        }

        // Se não informado, assume mês e ano atuais
        LocalDate hoje = LocalDate.now();
        int mesFatura = (mes != null) ? mes : hoje.getMonthValue();
        int anoFatura = (ano != null) ? ano : hoje.getYear();

        int diaFechamento = cartao.getDiaFechamento();

        // Calcular período de apuração da fatura
        // Início: dia seguinte ao fechamento do mês anterior
        YearMonth mesAnterior = YearMonth.of(anoFatura, mesFatura).minusMonths(1);
        int diaInicioReal = Math.min(diaFechamento + 1, mesAnterior.lengthOfMonth());
        LocalDate dataInicio = mesAnterior.atDay(diaInicioReal);

        // Fim: dia do fechamento do mês solicitado
        YearMonth mesSolicitado = YearMonth.of(anoFatura, mesFatura);
        int diaFimReal = Math.min(diaFechamento, mesSolicitado.lengthOfMonth());
        LocalDate dataFim = mesSolicitado.atDay(diaFimReal);

        // Converter para LocalDateTime para a query
        LocalDateTime inicioDateTime = dataInicio.atStartOfDay();
        LocalDateTime fimDateTime = dataFim.atTime(LocalTime.MAX);

        // Buscar transações de COMPRA_CREDITO no período
        List<Transacao> transacoesFatura = transacaoRepository
                .findByCartaoIdAndTipoAndDataBetween(
                        cartaoId,
                        TipoTransacao.COMPRA_CREDITO,
                        inicioDateTime,
                        fimDateTime);

        // Somar valores
        BigDecimal valorTotal = transacoesFatura.stream()
                .map(Transacao::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Data de vencimento: dia de pagamento do mês seguinte ao fechamento
        YearMonth mesPagamento = mesSolicitado.plusMonths(1);
        int diaPagamentoReal = Math.min(cartao.getDiaPagamento(), mesPagamento.lengthOfMonth());
        LocalDate dataVencimento = mesPagamento.atDay(Math.max(diaPagamentoReal, 1));

        // Status: ABERTA se hoje < fechamento, FECHADA caso contrário
        String statusFatura;
        if (hoje.isBefore(dataFim) || hoje.isEqual(dataFim)) {
            statusFatura = "ABERTA";
        } else {
            statusFatura = "FECHADA";
        }

        List<TransacaoResumoDto> transacoesDto = cartaoMapper.toTransacaoResumoDtoList(transacoesFatura);

        return new FaturaResponseDto(valorTotal, dataVencimento, statusFatura, transacoesDto);
    }

    @Transactional(readOnly = true)
    public List<TransacaoResumoDto> buscarTransacoesRecentes(Long cartaoId) {
        findCartaoOrThrow(cartaoId);

        Pageable pageable = PageRequest.of(0, 10);
        Page<Transacao> pagina = transacaoRepository.findRecentByCartaoId(cartaoId, pageable);

        return cartaoMapper.toTransacaoResumoDtoList(pagina.getContent());
    }

    private Cartao findCartaoOrThrow(Long id) {
        return cartaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cartão", id));
    }

    private void validarContaExistente(Long contaId) {
        if (!contaRepository.existsById(contaId)) {
            throw new ResourceNotFoundException("Conta", contaId);
        }
    }

    private String gerarNumeroCartaoUnico() {
        String numero;
        do {
            StringBuilder sb = new StringBuilder(16);
            for (int i = 0; i < 16; i++) {
                sb.append(SECURE_RANDOM.nextInt(10));
            }
            numero = sb.toString();
        } while (cartaoRepository.existsByNumeroCartao(numero));
        return numero;
    }

    private String gerarCvv() {
        return String.format("%03d", SECURE_RANDOM.nextInt(1000));
    }
}
