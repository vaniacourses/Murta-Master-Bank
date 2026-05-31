package com.mmb.api_mmb.Model;

import com.mmb.api_mmb.enums.StatusConta;
import com.mmb.api_mmb.enums.TipoConta;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "tb_conta")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "tipo_conta_heranca", discriminatorType = DiscriminatorType.STRING)
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class Conta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String numeroConta;

    @Column(nullable = false)
    private BigDecimal saldo; // BigDecimal para dinheiro, float gera erros de arredondamento

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoConta tipoConta; // Seu enum: CORRENTE, POUPANCA

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusConta status; // Seu enum: ATIVA, BLOQUEADA, ENCERRADA

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;



    @OneToMany(mappedBy = "conta", cascade = CascadeType.ALL)
    private List<Cartao> cartoes;


    @OneToMany(mappedBy = "conta", cascade = CascadeType.ALL)
    private List<Emprestimo> emprestimos;
}