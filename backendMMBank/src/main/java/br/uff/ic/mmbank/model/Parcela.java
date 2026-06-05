package br.uff.ic.mmbank.model;

import br.uff.ic.mmbank.model.enums.StatusParcela;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;


@Entity
@Table(name = "tb_parcela")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Parcela {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer numero;

    @Column(nullable = false)
    private LocalDate dataVencimento;

    private LocalDate dataPagamento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusParcela status;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal valor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "emprestimo_id", nullable = false)
    private Emprestimo emprestimo;
}