package com.mmb.api_mmb.Model;

import com.mmb.api_mmb.enums.StatusParcela;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "tb_parcela")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Parcela {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer numero; // Ex: Parcela 1, Parcela 2...

    @Column(nullable = false)
    private LocalDate dataVencimento;

    private LocalDate dataPagamento; // Pode ser null se ainda não foi paga

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusParcela status; // Seu enum: PENDENTE, PAGO, ATRASADO

    // Muitas parcelas pertencem a um Empréstimo
    @ManyToOne
    @JoinColumn(name = "emprestimo_id", nullable = false)
    private Emprestimo emprestimo;
}