package br.uff.ic.mmbank.service;

import br.uff.ic.mmbank.dto.UsuarioRequestDto;
import br.uff.ic.mmbank.dto.UsuarioResponseDto;
import br.uff.ic.mmbank.dto.ContaDto.ContaRequestDto;
import br.uff.ic.mmbank.factory.UsuarioFactory;
import br.uff.ic.mmbank.mapper.UsuarioMapper;
import br.uff.ic.mmbank.model.Usuario;
import br.uff.ic.mmbank.model.enums.TipoConta;
import br.uff.ic.mmbank.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioFactory usuarioFactory;
    private final UsuarioMapper usuarioMapper;

    private final ContaService contaService;

    @Transactional
    public UsuarioResponseDto criarUsuario(UsuarioRequestDto dto) {
        if (usuarioRepository.findByEmail(dto.email()).isPresent()) {
            throw new RuntimeException("Já existe um usuário cadastrado com este e-mail.");
        }
        String senhaCriptografada = passwordEncoder.encode(dto.senha());

        Usuario novoUsuario = usuarioFactory.criarUsuario(dto, senhaCriptografada);

        Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);

        if ("ROLE_USER".equals(usuarioSalvo.getRole().name())) {

            ContaRequestDto novaContaDto = new ContaRequestDto(
                    usuarioSalvo.getId(),
                    TipoConta.CORRENTE,
                    BigDecimal.ZERO
            );

            contaService.criarConta(novaContaDto);
        }

        return usuarioMapper.toResponseDto(usuarioSalvo);
    }
}