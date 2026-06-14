package br.uff.ic.mmbank.config;

import br.uff.ic.mmbank.model.ChavePix;
import br.uff.ic.mmbank.model.Cliente;
import br.uff.ic.mmbank.model.Conta;
import br.uff.ic.mmbank.model.Transacao;
import br.uff.ic.mmbank.model.enums.*;
import br.uff.ic.mmbank.repository.ChavePixRepository;
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
    CommandLineRunner initDatabase(ContaRepository contaRepository, 
                                   UsuarioRepository usuarioRepository,
                                   ChavePixRepository chavePixRepository,
                                   TransacaoRepository transacaoRepository) {
        return args -> {
            if (contaRepository.count() == 0) {

                org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder encoder = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
                String senhaPadrao = encoder.encode("123456");

                Cliente cliente1 = new Cliente();
                cliente1.setEmail("teste@mmbank.com");
                cliente1.setSenha(senhaPadrao);
                cliente1.setNome("Anderson Souza");
                cliente1.setRole(UserRole.ROLE_USER);
                cliente1.setDocumento("12345678909");
                cliente1.setTelefone("21999999999");
                cliente1.setEndereco("Rua da Boa Viagem, 123");
                cliente1.setGenero("m");
                cliente1.setProfissao("Assalariado");
                cliente1.setRendaMensal(new BigDecimal("5000.00"));
                cliente1.setDataNascimento(LocalDate.of(1990, 5, 15));
                cliente1 = usuarioRepository.save(cliente1);

                Conta conta1 = new Conta();
                conta1.setNumeroConta("12345-6");
                conta1.setSaldo(new BigDecimal("25000.00"));
                conta1.setStatusConta(StatusConta.ATIVA);
                conta1.setCliente(cliente1);
                conta1.setDataCriacao(LocalDateTime.now());
                conta1.setTipoConta(TipoConta.CORRENTE);
                conta1 = contaRepository.save(conta1);

                ChavePix pixAnderson = new ChavePix();
                pixAnderson.setChave("12345678909");
                pixAnderson.setTipo(TipoChavePix.CPF);
                pixAnderson.setConta(conta1);
                pixAnderson.setDataCriacao(LocalDateTime.now());
                chavePixRepository.save(pixAnderson);

                Cliente cliente2 = new Cliente();
                cliente2.setEmail("ana@mmbank.com");
                cliente2.setSenha(senhaPadrao);
                cliente2.setNome("Ana Costa");
                cliente2.setRole(UserRole.ROLE_USER);
                cliente2.setDocumento("99999999999");
                cliente2.setTelefone("21888888888");
                cliente2.setEndereco("Avenida Amaral Peixoto, 456");
                cliente2.setGenero("f");
                cliente2.setProfissao("Desenvolvedora");
                cliente2.setRendaMensal(new BigDecimal("8000.00"));
                cliente2.setDataNascimento(LocalDate.of(1995, 8, 20));
                cliente2 = usuarioRepository.save(cliente2);

                Conta conta2 = new Conta();
                conta2.setNumeroConta("54321-0");
                conta2.setSaldo(new BigDecimal("500.00"));
                conta2.setStatusConta(StatusConta.ATIVA);
                conta2.setCliente(cliente2);
                conta2.setDataCriacao(LocalDateTime.now());
                conta2.setTipoConta(TipoConta.CORRENTE);
                conta2 = contaRepository.save(conta2);

                ChavePix pixAna = new ChavePix();
                pixAna.setChave("99999999999");
                pixAna.setTipo(TipoChavePix.CPF);
                pixAna.setConta(conta2);
                pixAna.setDataCriacao(LocalDateTime.now());
                chavePixRepository.save(pixAna);

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

                transacaoRepository.saveAll(List.of(transacao1, transacao2, transacao3,
                                                    transacao4, transacao5, transacao6,
                                                    transacao7));

                System.out.println("CONTAS, CHAVES PIX E TRANSAÇÕES DE TESTE CRIADAS COM SUCESSO!");
            }
        };
    }
}