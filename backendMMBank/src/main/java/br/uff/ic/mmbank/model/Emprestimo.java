package br.uff.ic.mmbank.model;


import br.uff.ic.mmbank.model.enums.StatusEmprestimo;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_emprestimo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Emprestimo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal valorTotal;

    @Column(nullable = false, precision = 5, scale = 4)
    private BigDecimal taxaJuros;

    @Column(nullable = false)
    private Integer quantidadeParcelas;

    @Column(nullable = false)
    private LocalDate dataInicio;

    @Enumerated(EnumType.STRING)
    private StatusEmprestimo status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conta_id", nullable = false)
    private Conta conta;

    @OneToMany(
            mappedBy = "emprestimo",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Parcela> parcelas = new ArrayList<>();

    public Emprestimo(
            BigDecimal valorTotal,
            Integer quantidadeParcelas,
            BigDecimal taxaJuros,
            LocalDate dataInicio,
            Conta conta
    ) {
        this.valorTotal = valorTotal;
        this.quantidadeParcelas = quantidadeParcelas;
        this.taxaJuros = taxaJuros;
        this.dataInicio = dataInicio;
        this.conta = conta;
        this.status = StatusEmprestimo.ATIVO;
    }
}