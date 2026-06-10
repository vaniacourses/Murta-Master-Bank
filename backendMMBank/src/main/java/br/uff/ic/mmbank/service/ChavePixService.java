package br.uff.ic.mmbank.service;

import br.uff.ic.mmbank.dto.ChavePixRequestDto;
import br.uff.ic.mmbank.model.enums.TipoChavePix;
import br.uff.ic.mmbank.model.ChavePix;
import br.uff.ic.mmbank.repository.ChavePixRepository;
import br.uff.ic.mmbank.repository.ContaRepository;
import br.uff.ic.mmbank.repository.UsuarioRepository;
import br.uff.ic.mmbank.model.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.*;

@Service
public class ChavePixService {

    private final ChavePixRepository chavePixRepository;
    private final ContaRepository contaRepository;
    private final UsuarioRepository usuarioRepository;

    @Autowired
    public ChavePixService(ChavePixRepository chavePixRepository, ContaRepository contaRepository, UsuarioRepository usuarioRepository) {
        this.chavePixRepository = chavePixRepository;
        this.contaRepository = contaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public ChavePix cadastrar(String authenticatedEmail, ChavePixRequestDto dto) {
        String chaveToUse = dto.chave();
        if (dto.tipo() == TipoChavePix.ALEATORIA) {
            chaveToUse = generateUniqueAleatoria();
        } else {
            if (chaveToUse == null || chaveToUse.isBlank()) {
                throw new ResponseStatusException(BAD_REQUEST, "Chave Pix vazia");
            }
            if (chavePixRepository.existsByChave(chaveToUse)) {
                throw new ResponseStatusException(CONFLICT, "Chave Pix já cadastrada");
            }
        }
        Usuario usuario = usuarioRepository.findByEmail(authenticatedEmail)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Usuário autenticado não encontrado"));

        var conta = contaRepository.findByClienteId(usuario.getId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Conta do usuário não encontrada"));

        var entidade = new ChavePix();
        entidade.setTipo(dto.tipo());
        entidade.setChave(chaveToUse);
        entidade.setConta(conta);

        return chavePixRepository.save(entidade);
    }

    @Transactional
    public ChavePix alterar(String authenticatedEmail, Long id, ChavePixRequestDto dto) {
        var existing = chavePixRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Chave Pix não encontrada"));

        Usuario usuario = usuarioRepository.findByEmail(authenticatedEmail)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Usuário autenticado não encontrado"));

        if (!existing.getConta().getCliente().getId().equals(usuario.getId())) {
            throw new ResponseStatusException(FORBIDDEN, "Chave Pix não pertence ao usuário autenticado");
        }

        if (dto.chave() == null || dto.chave().isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "Chave Pix vazia");
        }
        if (!existing.getChave().equals(dto.chave()) && chavePixRepository.existsByChave(dto.chave())) {
            throw new ResponseStatusException(CONFLICT, "Nova chave já cadastrada");
        }

        existing.setChave(dto.chave());
        existing.setTipo(dto.tipo());

        return chavePixRepository.save(existing);
    }

    @Transactional
    public void deletar(String authenticatedEmail, Long id) {
        var existing = chavePixRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Chave Pix não encontrada"));

        Usuario usuario = usuarioRepository.findByEmail(authenticatedEmail)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Usuário autenticado não encontrado"));

        if (!existing.getConta().getCliente().getId().equals(usuario.getId())) {
            throw new ResponseStatusException(FORBIDDEN, "Chave Pix não pertence ao usuário autenticado");
        }

        chavePixRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<ChavePix> listarPorContaAutenticada(String authenticatedEmail) {
        Usuario usuario = usuarioRepository.findByEmail(authenticatedEmail)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Usuário autenticado não encontrado"));

        var conta = contaRepository.findByClienteId(usuario.getId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Conta do usuário não encontrada"));

        return chavePixRepository.findByContaId(conta.getId());
    }

    private String generateUniqueAleatoria() {
        for (int attempt = 0; attempt < 5; attempt++) {
            String candidate = java.util.UUID.randomUUID().toString().replace("-", "");
            if (!chavePixRepository.existsByChave(candidate)) {
                return candidate;
            }
        }

        throw new ResponseStatusException(INTERNAL_SERVER_ERROR, "Não foi possível gerar chave aleatória única");
    }
}
