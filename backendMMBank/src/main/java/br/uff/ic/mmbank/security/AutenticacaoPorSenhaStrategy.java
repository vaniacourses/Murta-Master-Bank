package br.uff.ic.mmbank.security;

import br.uff.ic.mmbank.dto.AutenticacaoRequestDto;
import br.uff.ic.mmbank.model.Usuario;
import br.uff.ic.mmbank.repository.UsuarioRepository;
import br.uff.ic.mmbank.security.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AutenticacaoPorSenhaStrategy implements AutenticacaoStrategy {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    @Override
    public String autenticar(AutenticacaoRequestDto dto) {

        Usuario usuario = usuarioRepository.findByEmail(dto.email())
                .orElseThrow(() -> new RuntimeException("Credenciais inválidas"));

        // compara a senha criptografada!!
        if (!passwordEncoder.matches(dto.senha(), usuario.getSenha())) {
            throw new RuntimeException("Credenciais inválidas");
        }

        return tokenService.gerarToken(usuario);
    }
}