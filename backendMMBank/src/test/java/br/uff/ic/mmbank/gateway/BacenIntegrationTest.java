package br.uff.ic.mmbank.gateway;

import br.uff.ic.mmbank.dto.BacenDto.PixConsultaChaveResponseDto;
import br.uff.ic.mmbank.dto.BacenDto.PixTransferenciaRequestDto;
import br.uff.ic.mmbank.dto.BacenDto.PixTransferenciaResponseDto;
import br.uff.ic.mmbank.gateway.bacen.BacenSimulator;
import br.uff.ic.mmbank.model.Conta;
import br.uff.ic.mmbank.repository.ContaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BacenIntegrationTest {

    @Mock
    private ContaRepository contaRepository;

    @InjectMocks
    private BacenAdapter bacenAdapter;

    @Test
    void testBacenSimulatorIsSingletonAndThreadSafe() throws InterruptedException {
        int threadCount = 50;
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        CountDownLatch latch = new CountDownLatch(threadCount);
        BacenSimulator[] instances = new BacenSimulator[threadCount];
        AtomicInteger successCounter = new AtomicInteger(0);

        for (int i = 0; i < threadCount; i++) {
            final int index = i;
            executor.submit(() -> {
                try {
                    instances[index] = BacenSimulator.getInstance();
                    successCounter.incrementAndGet();
                } finally {
                    latch.countDown();
                }
            });
        }

        latch.await();
        executor.shutdown();

        assertEquals(threadCount, successCounter.get(), "Todos os threads devem obter a instância com sucesso.");
        BacenSimulator expectedInstance = BacenSimulator.getInstance();
        for (int i = 0; i < threadCount; i++) {
            assertSame(expectedInstance, instances[i],
                    "Todas as instâncias recuperadas em paralelo devem ser idênticas.");
        }
    }

    @Test
    void testConsultarChaveEncontrada() {
        // A chave "12345678909" é pré-populada no simulador
        PixConsultaChaveResponseDto response = bacenAdapter.consultarChave("12345678909");

        assertTrue(response.encontrada());
        assertEquals("12345678909", response.chave());
        assertEquals("CPF", response.tipoChave());
        assertEquals("MMBank", response.banco());
    }

    @Test
    void testConsultarChaveNaoEncontrada() {
        PixConsultaChaveResponseDto response = bacenAdapter.consultarChave("chave-inexistente");

        assertFalse(response.encontrada());
        assertNull(response.chave());
    }

    @Test
    void testEnviarOrdemPagamentoComSucesso() {
        // Arrange
        Long contaOrigemId = 1L;
        String chaveDestino = "teste@mmbank.com";
        BigDecimal valor = new BigDecimal("150.00");

        Conta contaOrigem = new Conta();
        contaOrigem.setId(contaOrigemId);
        contaOrigem.setNumeroConta("12345-6");

        when(contaRepository.findById(contaOrigemId)).thenReturn(Optional.of(contaOrigem));

        PixTransferenciaRequestDto request = new PixTransferenciaRequestDto(contaOrigemId, chaveDestino, valor);

        // Act
        PixTransferenciaResponseDto response = bacenAdapter.enviarOrdemPagamento(request);

        // Assert
        assertNotNull(response);
        assertEquals("LIQUIDADA", response.status());
        assertNotNull(response.endToEndId());
        assertTrue(response.endToEndId().startsWith("E"));
        assertEquals(valor, response.valor());
        verify(contaRepository, times(1)).findById(contaOrigemId);
    }

    @Test
    void testEnviarOrdemPagamentoRejeitadaPorValorInvalido() {
        // Arrange
        Long contaOrigemId = 2L;
        String chaveDestino = "teste@mmbank.com";
        BigDecimal valorInvalido = new BigDecimal("-50.00");

        Conta contaOrigem = new Conta();
        contaOrigem.setId(contaOrigemId);
        contaOrigem.setNumeroConta("54321-0");

        when(contaRepository.findById(contaOrigemId)).thenReturn(Optional.of(contaOrigem));

        PixTransferenciaRequestDto request = new PixTransferenciaRequestDto(contaOrigemId, chaveDestino, valorInvalido);

        // Act
        PixTransferenciaResponseDto response = bacenAdapter.enviarOrdemPagamento(request);

        // Assert
        assertNotNull(response);
        assertEquals("REJEITADA", response.status());
        assertNull(response.endToEndId());
        verify(contaRepository, times(1)).findById(contaOrigemId);
    }
}
