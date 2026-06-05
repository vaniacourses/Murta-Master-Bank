package br.uff.ic.mmbank.controller;

import br.uff.ic.mmbank.dto.CartaoDto.*;
import br.uff.ic.mmbank.service.CartaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cartoes")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CartaoController {

    private final CartaoService cartaoService;

    @GetMapping("/{id}")
    public ResponseEntity<CartaoResponseDto> buscarPorId(@PathVariable Long id) {
        CartaoResponseDto response = cartaoService.buscarPorId(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/conta/{contaId}")
    public ResponseEntity<List<CartaoResponseDto>> listarPorConta(@PathVariable Long contaId) {
        List<CartaoResponseDto> response = cartaoService.listarPorConta(contaId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<CartaoResponseDto> atualizarStatus(
            @PathVariable Long id,
            @Valid @RequestBody AtualizarStatusCartaoRequestDto dto) {
        CartaoResponseDto response = cartaoService.atualizarStatus(id, dto.status());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CartaoResponseDto> cancelar(@PathVariable Long id) {
        CartaoResponseDto response = cartaoService.cancelar(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/solicitar")
    public ResponseEntity<CartaoResponseDto> solicitarCartao(
            @Valid @RequestBody SolicitarCartaoRequestDto dto) {
        CartaoResponseDto response = cartaoService.solicitarCartao(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}/fatura")
    public ResponseEntity<FaturaResponseDto> calcularFatura(
            @PathVariable Long id,
            @RequestParam(required = false) Integer mes,
            @RequestParam(required = false) Integer ano) {
        FaturaResponseDto response = cartaoService.calcularFatura(id, mes, ano);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/transacoes-recentes")
    public ResponseEntity<List<TransacaoResumoDto>> buscarTransacoesRecentes(@PathVariable Long id) {
        List<TransacaoResumoDto> response = cartaoService.buscarTransacoesRecentes(id);
        return ResponseEntity.ok(response);
    }
}
