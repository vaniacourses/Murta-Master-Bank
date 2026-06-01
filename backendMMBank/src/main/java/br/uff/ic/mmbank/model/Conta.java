package br.uff.ic.mmbank.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "contas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conta { // Simulação de conta, provisório
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numeroConta;
    private BigDecimal saldo;
}
