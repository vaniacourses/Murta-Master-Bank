package br.uff.ic.mmbank.service;

import br.uff.ic.mmbank.dto.ExternalReceiptDto;
import br.uff.ic.mmbank.dto.BacenDto.PixConsultaChaveResponseDto;
import br.uff.ic.mmbank.gateway.BacenGateway;
import br.uff.ic.mmbank.model.Conta;
import br.uff.ic.mmbank.model.enums.TipoTransacao;
import br.uff.ic.mmbank.repository.ContaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PixServiceTest {

    @Mock
    private BacenGateway bacenGateway;

    @Mock
    private ContaRepository contaRepository;

    @Mock
    private TransacaoService transacaoService;

    @InjectMocks
    private PixService pixService;

    @Test
    void testReceberPixExternoComSucesso() {
        // Arrange
        String chave = "12345678909";
        BigDecimal valor = new BigDecimal("250.00");
        String e2eId = "E12345678";
        String bancoOrigem = "OutroBanco";

        ExternalReceiptDto receiptDto = new ExternalReceiptDto(chave, valor, e2eId, bancoOrigem, "0001", "98765-4");

        PixConsultaChaveResponseDto consultaDto = new PixConsultaChaveResponseDto(
                true, chave, "CPF", "0001", "12345-6", "MMBank");
        when(bacenGateway.consultarChave(chave)).thenReturn(consultaDto);

        Conta conta = new Conta();
        conta.setId(1L);
        conta.setNumeroConta("12345-6");
        conta.setSaldo(new BigDecimal("100.00"));

        when(contaRepository.findByNumeroContaForUpdate("12345-6")).thenReturn(Optional.of(conta));

        // Act
        pixService.receberPixExterno(receiptDto);

        // Assert
        verify(bacenGateway, times(1)).consultarChave(chave);
        verify(contaRepository, times(1)).findByNumeroContaForUpdate("12345-6");
        verify(transacaoService, times(1)).registrarCredito(
                conta, valor, TipoTransacao.PIX_RECEBIDO, e2eId, bancoOrigem);
    }

    @Test
    void testReceberPixExternoChaveNaoEncontrada() {
        // Arrange
        String chave = "chave-inexistente";
        ExternalReceiptDto receiptDto = new ExternalReceiptDto(chave, new BigDecimal("100.00"), "E123", "Outro", "0001",
                "1");

        PixConsultaChaveResponseDto consultaDto = new PixConsultaChaveResponseDto(
                false, null, null, null, null, null);
        when(bacenGateway.consultarChave(chave)).thenReturn(consultaDto);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> pixService.receberPixExterno(receiptDto));
        verify(contaRepository, never()).findByNumeroContaForUpdate(any());
        verify(transacaoService, never()).registrarCredito(any(), any(), any(), any(), any());
    }

    @Test
    void testReceberPixExternoChaveDeOutroBanco() {
        // Arrange
        String chave = "chave-outro";
        ExternalReceiptDto receiptDto = new ExternalReceiptDto(chave, new BigDecimal("100.00"), "E123", "Outro", "0001",
                "1");

        PixConsultaChaveResponseDto consultaDto = new PixConsultaChaveResponseDto(
                true, chave, "EMAIL", "0001", "98765-4", "OutroBanco");
        when(bacenGateway.consultarChave(chave)).thenReturn(consultaDto);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> pixService.receberPixExterno(receiptDto));
        verify(contaRepository, never()).findByNumeroContaForUpdate(any());
        verify(transacaoService, never()).registrarCredito(any(), any(), any(), any(), any());
    }

    @Test
    void testReceberPixExternoValorInvalido() {
        // Arrange
        ExternalReceiptDto receiptDto = new ExternalReceiptDto("123", new BigDecimal("-10.00"), "E123", "Outro", "0001",
                "1");

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> pixService.receberPixExterno(receiptDto));
        verify(bacenGateway, never()).consultarChave(any());
    }
}
