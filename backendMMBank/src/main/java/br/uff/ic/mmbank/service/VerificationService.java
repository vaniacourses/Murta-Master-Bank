package br.uff.ic.mmbank.service;

import br.uff.ic.mmbank.dto.ChavePixRequestDto;
import br.uff.ic.mmbank.dto.ConfirmVerificationRequestDto;
import br.uff.ic.mmbank.model.VerificationCode;
import br.uff.ic.mmbank.model.Usuario;
import br.uff.ic.mmbank.repository.ChavePixRepository;
import br.uff.ic.mmbank.repository.ContaRepository;
import br.uff.ic.mmbank.repository.UsuarioRepository;
import br.uff.ic.mmbank.repository.VerificationCodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Random;

import static org.springframework.http.HttpStatus.*;

@Service
public class VerificationService {

    private final VerificationCodeRepository verificationCodeRepository;
    private final UsuarioRepository usuarioRepository;
    private final ContaRepository contaRepository;
    private final ChavePixService chavePixService;
    private final ChavePixRepository chavePixRepository;

    @Autowired
    public VerificationService(VerificationCodeRepository verificationCodeRepository,
                               UsuarioRepository usuarioRepository,
                               ContaRepository contaRepository,
                               ChavePixService chavePixService,
                               ChavePixRepository chavePixRepository) {
        this.verificationCodeRepository = verificationCodeRepository;
        this.usuarioRepository = usuarioRepository;
        this.contaRepository = contaRepository;
        this.chavePixService = chavePixService;
        this.chavePixRepository = chavePixRepository;
    }

    @Transactional
    public Long requestVerification(String authenticatedEmail, ChavePixRequestDto dto) {
        // Verificação para email ou telefone
        if (!(dto.tipo().name().equals("EMAIL") || dto.tipo().name().equals("TELEFONE"))) {
            throw new ResponseStatusException(BAD_REQUEST, "Tipo não requer verificação");
        }

        if (dto.chave() == null || dto.chave().isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "Chave vazia");
        }

        if (chavePixRepository.existsByChave(dto.chave())) {
            throw new ResponseStatusException(CONFLICT, "Chave já cadastrada");
        }

        Usuario usuario = usuarioRepository.findByEmail(authenticatedEmail)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Usuário autenticado não encontrado"));

        var conta = contaRepository.findByClienteId(usuario.getId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Conta do usuário não encontrada"));

        VerificationCode v = new VerificationCode();
        v.setChave(dto.chave());
        v.setTipo(dto.tipo());
        v.setConta(conta);
        v.setCreatedAt(LocalDateTime.now());
        v.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        v.setUsed(false);
        v.setCode(generateNumericCode());

        verificationCodeRepository.save(v);

        // Envio simulado de SMS / email
        System.out.println("[Verificação] Enviando código para " + dto.tipo() + " -> " + dto.chave() + ": " + v.getCode());

        return v.getId();
    }

    @Transactional
    public Long confirmVerification(String authenticatedEmail, ConfirmVerificationRequestDto dto) {
        var vOpt = verificationCodeRepository.findByIdAndUsedFalse(dto.verificationId());
        var v = vOpt.orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Verificação não encontrada ou já usada"));

        if (v.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(BAD_REQUEST, "Código de verificação expirado");
        }

        if (!v.getCode().equals(dto.code())) {
            throw new ResponseStatusException(BAD_REQUEST, "Código de verificação inválido");
        }

        v.setUsed(true);
        verificationCodeRepository.save(v);

        ChavePixRequestDto chaveDto = new ChavePixRequestDto(v.getTipo(), v.getChave());
        var created = chavePixService.cadastrar(authenticatedEmail, chaveDto);

        return created.getId();
    }

    private String generateNumericCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return Integer.toString(code);
    }
}
