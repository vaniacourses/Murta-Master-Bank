package br.uff.ic.mmbank.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "transferencias")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transferencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conta_origem_id", nullable = false)
    private Conta contaOrigem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conta_destino_id", nullable = false)
    private Conta contaDestino;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "transferencia_id")
    private List<Transacao> transacoes = new ArrayList<>();
}