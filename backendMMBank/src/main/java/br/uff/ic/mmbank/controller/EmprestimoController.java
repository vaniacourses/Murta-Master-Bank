package br.uff.ic.mmbank.controller;



import br.uff.ic.mmbank.dto.EmprestimoRequestDto;
import br.uff.ic.mmbank.dto.EmprestimoResponseDto;
import br.uff.ic.mmbank.service.EmprestimoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/emprestimos")
@RequiredArgsConstructor
public class EmprestimoController {

    private final EmprestimoService emprestimoService;

    @PostMapping
    public ResponseEntity<EmprestimoResponseDto> criarEmprestimo(
            @RequestBody @Valid EmprestimoRequestDto dto) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(emprestimoService.criarEmprestimo(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmprestimoResponseDto> buscarPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                emprestimoService.buscarPorId(id)
        );
    }

    @GetMapping
    public ResponseEntity<List<EmprestimoResponseDto>> listarTodos() {

        return ResponseEntity.ok(
                emprestimoService.listarTodos()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id) {

        emprestimoService.deletar(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/conta/{contaId}")
    public ResponseEntity<List<EmprestimoResponseDto>>
    buscarEmprestimosPorConta(@PathVariable Long contaId) {

        return ResponseEntity.ok(
                emprestimoService.buscarEmprestimosPorConta(contaId)
        );
    }







}