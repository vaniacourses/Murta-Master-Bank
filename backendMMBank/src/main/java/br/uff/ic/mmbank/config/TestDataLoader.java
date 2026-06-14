package br.uff.ic.mmbank.config;

import br.uff.ic.mmbank.model.Cliente;
import br.uff.ic.mmbank.model.Conta;
import br.uff.ic.mmbank.model.Transacao;
import br.uff.ic.mmbank.model.enums.*;
import br.uff.ic.mmbank.repository.ContaRepository;
import br.uff.ic.mmbank.repository.TransacaoRepository;
import br.uff.ic.mmbank.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class TestDataLoader {

    @Bean
    CommandLineRunner initDatabase(ContaRepository contaRepository, UsuarioRepository usuarioRepository, TransacaoRepository transacaoRepository) {
        return args -> {
            if (contaRepository.count() == 0) {

                // 1. Criamos a instância de Cliente
                Cliente cliente = new Cliente();

                cliente.setEmail("teste@mmbank.com");

                org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder encoder = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
                cliente.setSenha(encoder.encode("123456"));

                cliente.setNome("Anderson Souza");
                cliente.setRole(UserRole.ROLE_USER);
                cliente.setDocumento("12345678900");
                cliente.setTelefone("21999999999");
                cliente.setEndereco("Rua da Boa Viagem, 123");
                cliente.setGenero("m");
                cliente.setProfissao("Assalariado");
                cliente.setRendaMensal(new BigDecimal("5000.00"));
                cliente.setDataNascimento(LocalDate.of(1990, 5, 15));

                cliente = usuarioRepository.save(cliente);

                Conta conta1 = new Conta();
                conta1.setNumeroConta("12345-6");
                conta1.setSaldo(new BigDecimal("1000.00"));
                conta1.setStatusConta(StatusConta.ATIVA);
                conta1.setCliente(cliente);
                conta1.setDataCriacao(java.time.LocalDateTime.now());
                conta1.setTipoConta(TipoConta.CORRENTE);

                Transacao transacao1 = Transacao.builder()
                        .tipo(TipoTransacao.PIX_RECEBIDO)
                        .valor(new BigDecimal("1500.00"))
                        .data(LocalDateTime.now().minusDays(2))
                        .status(StatusTransacao.CONCLUIDA)
                        .conta(conta1)
                        .cartao(null)
                        .categoria("Receitas")
                        .endToEndId("E12345678202606140000abcde123456")
                        .ispbDestino("99999999")
                        .build();

                Transacao transacao2 = Transacao.builder()
                        .tipo(TipoTransacao.COMPRA_DEBITO)
                        .valor(new BigDecimal("45.90"))
                        .data(LocalDateTime.now().minusDays(1))
                        .status(StatusTransacao.CONCLUIDA)
                        .conta(conta1)
                        .cartao(null)
                        .categoria("Transporte")
                        .build();

                Transacao transacao3 = Transacao.builder()
                        .tipo(TipoTransacao.COMPRA_CREDITO)
                        .valor(new BigDecimal("2100.00"))
                        .data(LocalDateTime.now()) // Agora
                        .status(StatusTransacao.CONCLUIDA)
                        .conta(conta1)
                        .cartao(null)
                        .categoria("Moradia")
                        .build();

                Transacao transacao4 = Transacao.builder()
                        .tipo(TipoTransacao.PIX_RECEBIDO)
                        .valor(new BigDecimal("1237.00"))
                        .data(LocalDateTime.now().minusDays(3))
                        .status(StatusTransacao.CONCLUIDA)
                        .conta(conta1)
                        .cartao(null)
                        .categoria("Transporte")
                        .build();

                Transacao transacao5 = Transacao.builder()
                        .tipo(TipoTransacao.PIX_RECEBIDO)
                        .valor(new BigDecimal("10.00"))
                        .data(LocalDateTime.now().minusDays(4))
                        .status(StatusTransacao.CONCLUIDA)
                        .conta(conta1)
                        .cartao(null)
                        .categoria("Transporte")
                        .build();

                Transacao transacao6 = Transacao.builder()
                        .tipo(TipoTransacao.PIX_RECEBIDO)
                        .valor(new BigDecimal("400.00"))
                        .data(LocalDateTime.now().minusDays(5))
                        .status(StatusTransacao.CONCLUIDA)
                        .conta(conta1)
                        .cartao(null)
                        .categoria("Transporte")
                        .build();

                Transacao transacao7 = Transacao.builder()
                        .tipo(TipoTransacao.PIX_RECEBIDO)
                        .valor(new BigDecimal("100.00"))
                        .data(LocalDateTime.now().minusDays(6))
                        .status(StatusTransacao.CONCLUIDA)
                        .conta(conta1)
                        .cartao(null)
                        .categoria("Transporte")
                        .build();

                Conta conta2 = new Conta();
                conta2.setNumeroConta("78910-1");
                conta2.setSaldo(new BigDecimal("500.00"));
                conta2.setStatusConta(StatusConta.ATIVA);
                conta2.setCliente(cliente);
                conta2.setDataCriacao(java.time.LocalDateTime.now());
                conta2.setTipoConta(TipoConta.CORRENTE);

                contaRepository.saveAll(List.of(conta1, conta2));

                transacaoRepository.saveAll(List.of(transacao1, transacao2, transacao3,
                                                    transacao4, transacao5, transacao6,
                                                    transacao7));

                System.out.println("CONTAS DE TESTE CRIADAS COM SUCESSO");
            }
        };
    }
}