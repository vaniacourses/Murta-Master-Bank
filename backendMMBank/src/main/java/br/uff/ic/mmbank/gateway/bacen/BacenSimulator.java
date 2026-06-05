package br.uff.ic.mmbank.gateway.bacen;

import java.math.BigDecimal;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * GoF Singleton implementation of the Central Bank (BACEN) API simulation.
 * It manages Pix key query and payment order settlement synchronously.
 * <p>
 * Thread safety is guaranteed via double-checked locking and a volatile instance reference.
 */
public class BacenSimulator {

    private static volatile BacenSimulator instance;

    // ConcurrentHashMap provides thread-safety for simulating the state of keys registered at BACEN.
    private final ConcurrentHashMap<String, BacenContaInfo> chavesPixRegistradas = new ConcurrentHashMap<>();

    private BacenSimulator() {
        // Populate with some simulated accounts/keys for validation
        chavesPixRegistradas.put("12345678909", new BacenContaInfo("12345678909", "CPF", "0001", "12345-6", "MMBank"));
        chavesPixRegistradas.put("teste@mmbank.com", new BacenContaInfo("teste@mmbank.com", "EMAIL", "0001", "98765-4", "OutroBanco"));
        chavesPixRegistradas.put("99999999999", new BacenContaInfo("99999999999", "CPF", "0001", "54321-0", "MMBank"));
    }

    /**
     * Thread-safe double-checked locking Singleton accessor.
     *
     * @return the single instance of BacenSimulator
     */
    public static BacenSimulator getInstance() {
        if (instance == null) {
            synchronized (BacenSimulator.class) {
                if (instance == null) {
                    instance = new BacenSimulator();
                }
            }
        }
        return instance;
    }

    /**
     * Simulates synchronous key querying at the Central Bank registry.
     *
     * @param chave the Pix key to look up
     * @return the resolution result
     */
    public BacenConsultaChaveResponse consultarChave(String chave) {
        BacenContaInfo info = chavesPixRegistradas.get(chave);
        if (info == null) {
            return BacenConsultaChaveResponse.builder()
                    .encontrada(false)
                    .build();
        }
        return BacenConsultaChaveResponse.builder()
                .encontrada(true)
                .chave(info.getChave())
                .tipoChave(info.getTipoChave())
                .agencia(info.getAgencia())
                .numeroConta(info.getNumeroConta())
                .banco(info.getBanco())
                .build();
    }

    /**
     * Simulates synchronous Pix payment order settlement by the Central Bank.
     *
     * @param request the payment order request
     * @return the execution response
     */
    public BacenOrdemPagamentoResponse processarOrdemPagamento(BacenOrdemPagamentoRequest request) {
        if (request.getValor() == null || request.getValor().compareTo(BigDecimal.ZERO) <= 0) {
            return BacenOrdemPagamentoResponse.builder()
                    .status("REJEITADA")
                    .mensagem("Valor do Pix deve ser maior que zero.")
                    .build();
        }

        if (request.getChaveDestino() == null || request.getChaveDestino().isBlank()) {
            return BacenOrdemPagamentoResponse.builder()
                    .status("REJEITADA")
                    .mensagem("Chave Pix de destino é obrigatória.")
                    .build();
        }

        // Simulate successful settlement (UC05)
        String endToEndId = "E" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 8);
        return BacenOrdemPagamentoResponse.builder()
                .status("LIQUIDADA")
                .endToEndId(endToEndId)
                .mensagem("Transação liquidada com sucesso no BACEN.")
                .build();
    }

    /**
     * Allows dynamically registering keys during tests.
     */
    public void registrarChave(BacenContaInfo contaInfo) {
        chavesPixRegistradas.put(contaInfo.getChave(), contaInfo);
    }

    /**
     * Clears all simulator records (useful for test isolation).
     */
    public void limparChaves() {
        chavesPixRegistradas.clear();
    }
}
