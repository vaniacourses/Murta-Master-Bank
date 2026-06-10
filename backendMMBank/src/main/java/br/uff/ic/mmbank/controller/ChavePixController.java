package br.uff.ic.mmbank.controller;

import br.uff.ic.mmbank.dto.ChavePixRequestDto;
import br.uff.ic.mmbank.dto.ChavePixResponseDto;
import br.uff.ic.mmbank.model.ChavePix;
import br.uff.ic.mmbank.service.ChavePixService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pix/chaves")
public class ChavePixController {

    private final ChavePixService service;
    private final VerificationService verificationService;

    @Autowired
    public ChavePixController(ChavePixService service, VerificationService verificationService) {
        this.service = service;
        this.verificationService = verificationService;
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody ChavePixRequestDto dto, org.springframework.security.core.Authentication authentication) {
        String email = (String) authentication.getPrincipal();

        if (dto.tipo().name().equals("EMAIL") || dto.tipo().name().equals("TELEFONE")) {
            Long verificationId = verificationService.requestVerification(email, dto);
            return ResponseEntity.accepted().body(java.util.Map.of("verificationId", verificationId));
        }

        ChavePix criado = service.cadastrar(email, dto);
        ChavePixResponseDto resp = ChavePixResponseDto.fromEntity(criado);
        return ResponseEntity.created(URI.create("/api/pix/chaves/" + criado.getId())).body(resp);
    }

    @PostMapping("/confirm")
    public ResponseEntity<ChavePixResponseDto> confirmar(@RequestBody br.uff.ic.mmbank.dto.ConfirmVerificationRequestDto dto, org.springframework.security.core.Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        Long createdId = verificationService.confirmVerification(email, dto);
        var created = service.listarPorContaAutenticada(email).stream().filter(c -> c.getId().equals(createdId)).findFirst().orElseThrow();
        return ResponseEntity.ok(ChavePixResponseDto.fromEntity(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChavePixResponseDto> alterar(@PathVariable Long id, @RequestBody ChavePixRequestDto dto, org.springframework.security.core.Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        ChavePix atualizado = service.alterar(email, id, dto);
        return ResponseEntity.ok(ChavePixResponseDto.fromEntity(atualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id, org.springframework.security.core.Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        service.deletar(email, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/minhas")
    public ResponseEntity<List<ChavePixResponseDto>> listarMinhas(org.springframework.security.core.Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        List<ChavePix> list = service.listarPorContaAutenticada(email);
        List<ChavePixResponseDto> resp = list.stream().map(ChavePixResponseDto::fromEntity).collect(Collectors.toList());
        return ResponseEntity.ok(resp);
    }
}
