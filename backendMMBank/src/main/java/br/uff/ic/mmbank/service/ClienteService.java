package br.uff.ic.mmbank.service;

import br.uff.ic.mmbank.dto.UsuarioResponseDto;
import br.uff.ic.mmbank.dto.UsuarioUpdateDto;
import br.uff.ic.mmbank.model.Cliente;
import br.uff.ic.mmbank.repository.ClienteRepository;
import br.uff.ic.mmbank.mapper.UsuarioMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final UsuarioMapper usuarioMapper;

    public List<UsuarioResponseDto> listarTodos() {
        return clienteRepository.findAll()
                .stream()
                .map(usuarioMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    public UsuarioResponseDto buscarPorId(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado."));
        return usuarioMapper.toResponseDto(cliente);
    }

    @Transactional
    public UsuarioResponseDto atualizarCliente(Long id, UsuarioUpdateDto dto) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado."));
        if (dto.nome() != null) cliente.setNome(dto.nome());
        if (dto.telefone() != null) cliente.setTelefone(dto.telefone());
        if (dto.endereco() != null) cliente.setEndereco(dto.endereco());
        if (dto.rendaMensal() != null) cliente.setRendaMensal(dto.rendaMensal());
        if (dto.profissao() != null) cliente.setProfissao(dto.profissao());

        return usuarioMapper.toResponseDto(clienteRepository.save(cliente));
    }

    @Transactional
    public void deletarCliente(Long id) {
        if (!clienteRepository.existsById(id)) {
            throw new RuntimeException("Cliente não encontrado.");
        }
        clienteRepository.deleteById(id);
    }
}