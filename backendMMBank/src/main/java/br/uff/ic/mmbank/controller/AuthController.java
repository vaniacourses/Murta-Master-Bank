package br.uff.ic.mmbank.controller;

import br.uff.ic.mmbank.dto.AutenticacaoRequestDto;
import br.uff.ic.mmbank.dto.LoginResponseDto;
import br.uff.ic.mmbank.security.AutenticacaoStrategy;
import jakarta.validation.Valid;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AutenticacaoStrategy autenticacaoStrategy;

    public AuthController(AutenticacaoStrategy autenticacaoStrategy) {
        this.autenticacaoStrategy = autenticacaoStrategy;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody @Valid AutenticacaoRequestDto dto) {

        String token = autenticacaoStrategy.autenticar(dto);
        return ResponseEntity.ok(new LoginResponseDto(token));
    }
}