package br.uff.ic.mmbank.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
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

    @Column(name = "chave_pix_utilizada")
    private String chavePixUtilizada;

    @Column(name = "cpf_cnpj_favorecido")
    private String cpfCnpjFavorecido;

    @Column(name = "banco_favorecido")
    private String bancoFavorecido;

    @Column(name = "agencia_favorecida")
    private String agenciaFavorecida;

    @Column(name = "conta_favorecida")
    private String contaFavorecida;

    @Column(name = "tipo_envio")
    private String tipoEnvio;

    @Column(name = "data_agendamento")
    private LocalDate dataAgendamento;

    @Column(name = "descricao", length = 140)
    private String descricao;
}