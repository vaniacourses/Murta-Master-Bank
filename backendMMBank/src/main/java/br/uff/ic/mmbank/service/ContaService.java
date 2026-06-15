package br.uff.ic.mmbank.service;

import br.uff.ic.mmbank.dto.ContaDto.AtualizarStatusRequestDto;
import br.uff.ic.mmbank.dto.ContaDto.ContaRequestDto;
import br.uff.ic.mmbank.dto.ContaDto.ContaResponseDto;
import br.uff.ic.mmbank.mapper.ContaMapper;
import br.uff.ic.mmbank.model.Cliente;
import br.uff.ic.mmbank.model.Conta;
import br.uff.ic.mmbank.model.Usuario;
import br.uff.ic.mmbank.model.enums.StatusConta;
import br.uff.ic.mmbank.repository.ContaRepository;
import br.uff.ic.mmbank.repository.TransacaoRepository;
import br.uff.ic.mmbank.repository.UsuarioRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContaService {

    @Autowired
    private ContaRepository contaRepository;
    @Autowired
    private TransacaoRepository transacaoRepository;
    @Autowired
    private ContaMapper contaMapper;
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public ContaResponseDto criarConta(ContaRequestDto dto) {
        Cliente cliente = (Cliente) usuarioRepository.findById(dto.clienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado com o ID fornecido."));

        Conta conta = new Conta();
        conta.setCliente(cliente);
        conta.setTipoConta(dto.tipoConta());
        conta.setSaldo(dto.saldoInicial());
        conta.setStatusConta(StatusConta.ATIVA);
        conta.setDataCriacao(LocalDateTime.now());
        conta.setNumeroConta(gerarNumeroContaUnico());

        Conta contaSalva = contaRepository.save(conta);
        return contaMapper.toResponseDto(contaSalva);
    }

    public List<ContaResponseDto> listarContasPorCliente(Long clienteId) {
        // 1. Busca a lista de contas que não estão encerradas
        List<Conta> contas = contaRepository.findAllByClienteId(clienteId);

        return contas.stream()
                .map(contaMapper::toResponseDto) // Aqui ele usa automaticamente a sobrecarga que injeta BigDecimal.ZERO nos totais
                .collect(Collectors.toList());
    }

    public ContaResponseDto buscarPorId(Long id) {
        Conta conta = contaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada com ID: " + id));

        BigDecimal totalEntradas = transacaoRepository.calcularTotalEntradas(id);
        BigDecimal totalSaidas = transacaoRepository.calcularTotalSaidas(id);

        return contaMapper.toResponseDto(conta, totalEntradas, totalSaidas);
    }

    @Transactional
    public ContaResponseDto atualizarStatus(Long id, AtualizarStatusRequestDto dto) {

        Conta conta = contaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada."));

        if (conta.getStatusConta() == StatusConta.ENCERRADA) {
            throw new IllegalStateException("Não é permitido modificar uma conta que já foi ENCERRADA.");
        }

        if (dto.status() == StatusConta.ENCERRADA) {
            throw new IllegalArgumentException(
                    "Não é permitido alterar o status para ENCERRADA através deste fluxo. Use o método deletarConta."
            );
        }

        conta.setStatusConta(dto.status());

        return contaMapper.toResponseDto(contaRepository.save(conta));
    }

    @Transactional
    public void deletarConta(Long id) {
        Conta conta = contaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Impossível encerrar: Conta inexistente."));

        if (conta.getStatusConta() == StatusConta.ENCERRADA) {
            throw new IllegalStateException("Esta conta já se encontra ENCERRADA.");
        }

        if (conta.getSaldo().compareTo(java.math.BigDecimal.ZERO) != 0) {
            throw new IllegalStateException("Não é possível encerrar uma conta com saldo pendente (positivo ou negativo).");
        }

        conta.setStatusConta(StatusConta.ENCERRADA);

        contaRepository.save(conta);
    }

    private String gerarNumeroContaUnico() {
        Random random = new Random();
        String numeroGenerated;
        do {
            int numero = 100000 + random.nextInt(900000); // 6 dígitos
            int digito = random.nextInt(10);
            numeroGenerated = numero + "-" + digito;
        } while (contaRepository.existsByNumeroConta(numeroGenerated));

        return numeroGenerated;
    }

    @Transactional(readOnly = true)
    public ContaResponseDto buscarPorEmailCliente(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        Conta conta = contaRepository.findByClienteId(usuario.getId())
                .orElseThrow(() -> new IllegalArgumentException("Conta não encontrada para este usuário."));

        return contaMapper.toResponseDto(conta);
    }
}
