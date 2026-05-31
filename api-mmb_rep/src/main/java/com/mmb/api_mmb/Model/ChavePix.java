package com.mmb.api_mmb.Model;


import com.mmb.api_mmb.enums.TipoChavePix;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;


@Entity
@Table(name = "tb_chave_pix")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChavePix {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoChavePix tipo; // CPF, EMAIL, etc.

    @Column(nullable = false, unique = true)
    private String valor; //

    @Column(nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    @Column(nullable = false)
    private boolean ativa;


    @ManyToOne
    @JoinColumn(name = "conta_id", nullable = false)
    private Conta conta;

    @PrePersist
    protected void onCreate() {
        this.dataCriacao = LocalDateTime.now();
        this.ativa = true; // Toda chave Pix já nasce ativa por padrão ao ser criada
    }
}