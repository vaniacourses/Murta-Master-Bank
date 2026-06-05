package br.uff.ic.mmbank.model;

import br.uff.ic.mmbank.model.enums.StatusTransacao;
import br.uff.ic.mmbank.model.enums.TipoTransacao;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transacoes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private TipoTransacao tipo;

    private BigDecimal valor;

    private LocalDateTime data;

    @Enumerated(EnumType.STRING)
    private StatusTransacao status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conta_id", nullable = false)
    private Conta conta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cartao_id", nullable = true)
    private Cartao cartao;

    private String categoria;
    private String endToEndId;
    private String ispbDestino;
}