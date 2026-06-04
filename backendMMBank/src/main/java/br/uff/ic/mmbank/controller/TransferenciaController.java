package br.uff.ic.mmbank.controller;

import br.uff.ic.mmbank.dto.TransferenciaRequestDto;
import br.uff.ic.mmbank.dto.TransferenciaResponseDto;
import br.uff.ic.mmbank.model.enums.TipoTransacao;
import br.uff.ic.mmbank.service.TransferenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transferencias")
public class TransferenciaController {

    private final TransferenciaService transferenciaService;

    @Autowired
    public TransferenciaController(TransferenciaService transferenciaService) {
        this.transferenciaService = transferenciaService;
    }

    @PostMapping
    public ResponseEntity<TransferenciaResponseDto> realizar(@RequestBody TransferenciaRequestDto dto) {
        // Por padrão, se usar esta rota genérica, assume-se do tipo TRANSFERENCIA (TED)
        TransferenciaResponseDto response = transferenciaService.realizar(dto, TipoTransacao.TRANSFERENCIA);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/pix")
    public ResponseEntity<TransferenciaResponseDto> realizarPix(@RequestBody TransferenciaRequestDto dto) {
        TransferenciaResponseDto response = transferenciaService.realizar(dto, TipoTransacao.PIX_ENVIADO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransferenciaResponseDto> buscarPorId(@PathVariable Long id) {
        TransferenciaResponseDto response = transferenciaService.buscarPorId(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/conta/{contaId}")
    public ResponseEntity<List<TransferenciaResponseDto>> listarPorConta(@PathVariable Long contaId) {
        List<TransferenciaResponseDto> response = transferenciaService.listarPorConta(contaId);
        return ResponseEntity.ok(response);
    }
}