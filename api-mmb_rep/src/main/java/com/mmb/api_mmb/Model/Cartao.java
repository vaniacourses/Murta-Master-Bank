package com.mmb.api_mmb.Model;

import com.mmb.api_mmb.enums.TipoCartao;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "tb_cartao")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "tipo_cartao_heranca")
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class Cartao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String numero;

    @Column(nullable = false)
    private Integer cvv;

    @Column(nullable = false)
    private LocalDate dataValidade;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoCartao statusCartao; // Seu enum: DEBITO, CREDITO

    // Muitos cartões pertencem a uma Conta
    @ManyToOne
    @JoinColumn(name = "conta_id", nullable = false)
    private Conta conta;
}