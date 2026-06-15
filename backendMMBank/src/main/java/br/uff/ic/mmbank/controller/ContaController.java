package br.uff.ic.mmbank.controller;

import br.uff.ic.mmbank.dto.ContaDto.AtualizarStatusRequestDto;
import br.uff.ic.mmbank.dto.ContaDto.ContaRequestDto;
import br.uff.ic.mmbank.dto.ContaDto.ContaResponseDto;
import br.uff.ic.mmbank.service.ContaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/contas")
@RequiredArgsConstructor
public class ContaController {

    @Autowired
    private ContaService contaService;

    @PostMapping
    public ResponseEntity<ContaResponseDto> criarConta(@RequestBody @Valid ContaRequestDto contaRequestDto) {
        ContaResponseDto response = contaService.criarConta(contaRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<?> listarContasPorCliente(@PathVariable Long clienteId) {
        if (clienteId == null) {
            return ResponseEntity.badRequest()
                    .body("O parâmetro 'clienteId' é obrigatório para listar as contas.");
        }
        List<ContaResponseDto> contas = contaService.listarContasPorCliente(clienteId);
        return ResponseEntity.ok(contas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContaResponseDto> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(contaService.buscarPorId(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ContaResponseDto> atualizarStatus(
            @PathVariable Long id,
            @RequestBody @Valid AtualizarStatusRequestDto dto) {
        ContaResponseDto response = contaService.atualizarStatus(id, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarConta(@PathVariable Long id) {
        contaService.deletarConta(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/minha")
    public ResponseEntity<ContaResponseDto> buscarMinhaConta(org.springframework.security.core.Authentication authentication) {
        String emailAutenticado = (String) authentication.getPrincipal();

        ContaResponseDto response = contaService.buscarPorEmailCliente(emailAutenticado);
        return ResponseEntity.ok(response);
    }
}