package br.uff.ic.mmbank.controller;

import br.uff.ic.mmbank.dto.UsuarioRequestDto;
import br.uff.ic.mmbank.dto.UsuarioResponseDto;
import br.uff.ic.mmbank.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<UsuarioResponseDto> criar(@RequestBody @Valid UsuarioRequestDto dto) {
        UsuarioResponseDto response = usuarioService.criarUsuario(dto);

        // retorna http 201
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}