package br.uff.ic.mmbank.model;

import br.uff.ic.mmbank.model.enums.StatusConta;
import br.uff.ic.mmbank.model.enums.TipoConta;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "contas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Conta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String numeroConta;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal saldo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoConta tipoConta;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusConta statusConta;

    @Column(nullable = false)
    private LocalDateTime dataCriacao;

    @ManyToOne(optional = false)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @OneToMany(
            mappedBy = "conta",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Emprestimo> emprestimos = new ArrayList<>();
}