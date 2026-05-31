package com.mmb.api_mmb.Model;

import com.mmb.api_mmb.enums.StatusEmprestimo;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "tb_emprestimo")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Emprestimo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private BigDecimal valorTotal;

    @Column(nullable = false)
    private BigDecimal taxaJuros;

    @Column(nullable = false)
    private Integer quantidadeParcelas;

    @Column(nullable = false)
    private LocalDate dataInicio;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusEmprestimo status;


    @ManyToOne
    @JoinColumn(name = "conta_id", nullable = false)
    private Conta conta;

    // Um empréstimo possui Muitas Parcelas.
    // cascade = CascadeType.ALL faz com que, ao salvar o Empréstimo, as parcelas sejam salvas juntas automaticamente.
    @OneToMany(mappedBy = "emprestimo", cascade = CascadeType.ALL)
    private List<Parcela> parcelas;
}