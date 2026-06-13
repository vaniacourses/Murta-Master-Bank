package br.uff.ic.mmbank.config;

import br.uff.ic.mmbank.model.ChavePix;
import br.uff.ic.mmbank.model.Cliente;
import br.uff.ic.mmbank.model.Conta;
import br.uff.ic.mmbank.model.enums.StatusConta;
import br.uff.ic.mmbank.model.enums.TipoChavePix;
import br.uff.ic.mmbank.model.enums.TipoConta;
import br.uff.ic.mmbank.model.enums.UserRole;
import br.uff.ic.mmbank.repository.ChavePixRepository;
import br.uff.ic.mmbank.repository.ContaRepository;
import br.uff.ic.mmbank.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
public class TestDataLoader {

    @Bean
    CommandLineRunner initDatabase(ContaRepository contaRepository,
                                   UsuarioRepository usuarioRepository,
                                   ChavePixRepository chavePixRepository) {
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

                System.out.println("CONTAS E CHAVES PIX DE TESTE CRIADAS COM SUCESSO");
            }
        };
    }
}