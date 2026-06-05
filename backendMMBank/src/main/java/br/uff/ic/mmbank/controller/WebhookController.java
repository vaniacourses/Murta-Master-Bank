package br.uff.ic.mmbank.controller;

import br.uff.ic.mmbank.dto.ExternalReceiptDto;
import br.uff.ic.mmbank.service.PixService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WebhookController {

    private final PixService pixService;

    @Autowired
    public WebhookController(PixService pixService) {
        this.pixService = pixService;
    }

    @PostMapping("/webhook/pix")
    public ResponseEntity<Void> receberPixExterno(@RequestBody ExternalReceiptDto dto) {
        try {
            pixService.receberPixExterno(dto);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
