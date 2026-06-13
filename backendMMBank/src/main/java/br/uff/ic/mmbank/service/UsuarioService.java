package br.uff.ic.mmbank.service;

import br.uff.ic.mmbank.dto.UsuarioRequestDto;
import br.uff.ic.mmbank.dto.UsuarioResponseDto;
import br.uff.ic.mmbank.factory.UsuarioFactory;
import br.uff.ic.mmbank.mapper.UsuarioMapper;
import br.uff.ic.mmbank.model.Usuario;
import br.uff.ic.mmbank.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioFactory usuarioFactory;
    private final UsuarioMapper usuarioMapper;

    @Transactional
    public UsuarioResponseDto criarUsuario(UsuarioRequestDto dto) {
        // 1. Regra de Negócio: Verificar se o e-mail já existe
        if (usuarioRepository.findByEmail(dto.email()).isPresent()) {
            throw new RuntimeException("Já existe um usuário cadastrado com este e-mail.");
        }

        // 2. Segurança: Criptografar a senha
        String senhaCriptografada = passwordEncoder.encode(dto.senha());

        // 3. Padrão GoF: Usar a Factory para instanciar a subclasse correta
        Usuario novoUsuario = usuarioFactory.criarUsuario(dto, senhaCriptografada);

        // 4. Persistência: Salvar no banco
        Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);

        return usuarioMapper.toResponseDto(usuarioSalvo);
    }
}