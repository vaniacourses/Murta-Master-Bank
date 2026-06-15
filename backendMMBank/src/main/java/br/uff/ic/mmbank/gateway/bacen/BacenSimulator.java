package br.uff.ic.mmbank.gateway.bacen;

import java.math.BigDecimal;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;


public class BacenSimulator {

    private static volatile BacenSimulator instance;

    private final ConcurrentHashMap<String, BacenContaInfo> chavesPixRegistradas = new ConcurrentHashMap<>();

    private BacenSimulator() {
        chavesPixRegistradas.put("12345678909", new BacenContaInfo("12345678909", "CPF", "0001", "12345-6", "MMBank"));
        chavesPixRegistradas.put("teste@mmbank.com", new BacenContaInfo("teste@mmbank.com", "EMAIL", "0001", "98765-4", "OutroBanco"));
        chavesPixRegistradas.put("99999999999", new BacenContaInfo("99999999999", "CPF", "0001", "54321-0", "MMBank"));
    }

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
        String endToEndId = "E" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 8);
        return BacenOrdemPagamentoResponse.builder()
                .status("LIQUIDADA")
                .endToEndId(endToEndId)
                .mensagem("Transação liquidada com sucesso no BACEN.")
                .build();
    }

    public void registrarChave(BacenContaInfo contaInfo) {
        chavesPixRegistradas.put(contaInfo.getChave(), contaInfo);
    }

    public void limparChaves() {
        chavesPixRegistradas.clear();
    }
}
