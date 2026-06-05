package br.uff.ic.mmbank.service;

import br.uff.ic.mmbank.dto.EmprestimoRequestDto;
import br.uff.ic.mmbank.dto.EmprestimoResponseDto;
import br.uff.ic.mmbank.mapper.EmprestimoMapper;
import br.uff.ic.mmbank.model.Conta;
import br.uff.ic.mmbank.model.Emprestimo;
import br.uff.ic.mmbank.model.Parcela;
import br.uff.ic.mmbank.model.enums.StatusConta;
import br.uff.ic.mmbank.model.enums.StatusEmprestimo;
import br.uff.ic.mmbank.model.enums.StatusParcela;
import br.uff.ic.mmbank.repository.ContaRepository;
import br.uff.ic.mmbank.repository.EmprestimoRepository;

import br.uff.ic.mmbank.repository.ParcelaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class EmprestimoService {

    private final EmprestimoRepository emprestimoRepository;
    private final ContaRepository contaRepository;
    private final EmprestimoMapper emprestimoMapper;
    private final ParcelaRepository parcelaRepository ;

    public EmprestimoResponseDto criarEmprestimo(EmprestimoRequestDto dto) {

        Conta conta = contaRepository.findById(dto.contaId())
                .orElseThrow(() ->
                        new RuntimeException("Conta não encontrada"));

        if (conta.getStatusConta() == StatusConta.BLOQUEADA ||
                conta.getStatusConta() == StatusConta.ENCERRADA) {

            throw new RuntimeException(
                    "Impossibilitado de fazer o empréstimo");
        }

        BigDecimal taxaJuros = new BigDecimal("0.05");

        Emprestimo emprestimo = new Emprestimo(
                dto.valorTotal(),
                dto.quantidadeParcelas(),
                taxaJuros,
                LocalDate.now(),
                conta
        );

        List<Parcela> parcelas = new ArrayList<>();

        BigDecimal valorBaseParcela =
                dto.valorTotal().divide(
                        BigDecimal.valueOf(dto.quantidadeParcelas()),
                        2,
                        RoundingMode.HALF_UP
                );

        for (int i = 1; i <= dto.quantidadeParcelas(); i++) {

            BigDecimal juros =
                    valorBaseParcela.multiply(taxaJuros);

            BigDecimal valorFinal =
                    valorBaseParcela.add(juros);

            Parcela parcela = new Parcela();

            parcela.setNumero(i);
            parcela.setValor(valorFinal);
            parcela.setDataVencimento(
                    LocalDate.now().plusMonths(i)
            );
            parcela.setStatus(StatusParcela.PENDENTE);
            parcela.setEmprestimo(emprestimo);

            parcelas.add(parcela);
        }

        emprestimo.setParcelas(parcelas);

        Emprestimo salvo =
                emprestimoRepository.save(emprestimo);

        return emprestimoMapper.toResponseDto(salvo);
    }

    public EmprestimoResponseDto buscarPorId(Long id) {

        Emprestimo emprestimo =
                emprestimoRepository
                        .buscarPorIdComParcelas(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Empréstimo não encontrado"));

        return emprestimoMapper.toResponseDto(emprestimo);
    }

    public List<EmprestimoResponseDto> listarTodos() {

        return emprestimoRepository
                .listarComParcelas()
                .stream()
                .map(emprestimoMapper::toResponseDto)
                .toList();
    }

    public void deletar(Long id) {

        if (!emprestimoRepository.existsById(id)) {
            throw new RuntimeException(
                    "Empréstimo não encontrado");
        }

        emprestimoRepository.deleteById(id);
    }


    public List<EmprestimoResponseDto> buscarEmprestimosPorConta(Long contaId) {

        List<Emprestimo> emprestimos =
                emprestimoRepository.buscarPorContaId(contaId);

        return emprestimos.stream()
                .map(emprestimoMapper::toResponseDto)
                .toList();
    }




    @Transactional
    public void pagarParcela(Long parcelaId) {

        Parcela parcela = parcelaRepository
                .findById(parcelaId)
                .orElseThrow(() ->
                        new RuntimeException("Parcela não encontrada"));

        if (parcela.getStatus() == StatusParcela.PAGO) {
            throw new RuntimeException("Parcela já foi paga");
        }

        parcela.setStatus(StatusParcela.PAGO);
        parcela.setDataPagamento(LocalDate.now());

        parcelaRepository.save(parcela);

        Emprestimo emprestimo = parcela.getEmprestimo();

        boolean todasPagas =
                emprestimo.getParcelas()
                        .stream()
                        .allMatch(p ->
                                p.getStatus() == StatusParcela.PAGO);

        if (todasPagas) {

            emprestimo.setStatus(StatusEmprestimo.QUITADO);

            emprestimoRepository.save(emprestimo);
        }
    }



}