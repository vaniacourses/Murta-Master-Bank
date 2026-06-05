package br.uff.ic.mmbank.controller;

import br.uff.ic.mmbank.service.EmprestimoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/parcelas")
@RequiredArgsConstructor
public class ParcelaController {

    private final EmprestimoService emprestimoService;

    @PatchMapping("/{id}/pagar")
    public ResponseEntity<Void> pagarParcela(
            @PathVariable Long id) {

        emprestimoService.pagarParcela(id);

        return ResponseEntity.noContent().build();
    }
}