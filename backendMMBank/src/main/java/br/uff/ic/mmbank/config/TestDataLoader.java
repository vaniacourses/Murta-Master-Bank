package br.uff.ic.mmbank.config;

import br.uff.ic.mmbank.model.Cliente;
import br.uff.ic.mmbank.model.Conta;
import br.uff.ic.mmbank.model.enums.StatusConta;
import br.uff.ic.mmbank.model.enums.TipoConta;
import br.uff.ic.mmbank.model.enums.UserRole;
import br.uff.ic.mmbank.repository.ContaRepository;
import br.uff.ic.mmbank.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Configuration
public class TestDataLoader {

    @Bean
    CommandLineRunner initDatabase(ContaRepository contaRepository, UsuarioRepository usuarioRepository) {
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

                Conta conta2 = new Conta();
                conta2.setNumeroConta("78910-1");
                conta2.setSaldo(new BigDecimal("500.00"));
                conta2.setStatusConta(StatusConta.ATIVA);
                conta2.setCliente(cliente);
                conta2.setDataCriacao(java.time.LocalDateTime.now());
                conta2.setTipoConta(TipoConta.CORRENTE);

                contaRepository.saveAll(List.of(conta1, conta2));

                System.out.println("CONTAS DE TESTE CRIADAS COM SUCESSO");
            }
        };
    }
}