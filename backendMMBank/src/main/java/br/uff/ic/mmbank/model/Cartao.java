package br.uff.ic.mmbank.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import br.uff.ic.mmbank.model.enums.StatusCartao;
import br.uff.ic.mmbank.model.enums.TipoCartao;

@Entity
@Table(name = "cartoes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cartao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conta_id", nullable = false)
    private Conta conta;

    @Column(name = "tipo", nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoCartao tipo;

    @Column(name = "limite", nullable = false, precision = 19, scale = 2)
    private BigDecimal limite;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusCartao status;

    @Column(name = "numero_cartao", nullable = false, unique = true)
    private String numeroCartao;

    @Column(name = "cvv", nullable = false)
    private String cvv;

    @Column(name = "data_validade", nullable = false)
    private LocalDate dataValidade;

    @Column(name = "data_emissao", nullable = false)
    private LocalDate dataEmissao;

    @OneToMany(mappedBy = "cartao", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transacao> transacoes;

    @Column(name = "dia_fechamento", nullable = false)
    private int diaFechamento;

    @Column(name = "dia_pagamento", nullable = false)
    private int diaPagamento;
}
