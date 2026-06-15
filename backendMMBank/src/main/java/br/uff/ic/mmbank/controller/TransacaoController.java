package br.uff.ic.mmbank.controller;

import br.uff.ic.mmbank.dto.TransacaoDto;
import br.uff.ic.mmbank.exception.ResourceNotFoundException;
import br.uff.ic.mmbank.model.Transacao;
import br.uff.ic.mmbank.service.TransacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transacoes")
@CrossOrigin(origins = "*")
public class TransacaoController {

    @Autowired
    private TransacaoService transacaoService;

    @GetMapping("/contas/paginada/{id}")
    public ResponseEntity<?> listarPorConta(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        try {
            Page<Transacao> transacoesPaginadas = transacaoService.buscarExtratoPaginado(id, page, size);

            // 🛠️ USANDO LAMBDA: Remove o erro do IntelliJ na hora
            Page<TransacaoDto> dtoPage = transacoesPaginadas.map(t -> new TransacaoDto(t));

            return ResponseEntity.ok(dtoPage);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao processar extrato paginado.");
        }
    }

    @GetMapping("/contas/{id}")
    public ResponseEntity<List<TransacaoDto>> listarTodasTransacoes(@PathVariable Long id) {
        List<TransacaoDto> transacoes = transacaoService.listarTodasTransacoesPorConta(id);
        return ResponseEntity.ok(transacoes);
    }
}