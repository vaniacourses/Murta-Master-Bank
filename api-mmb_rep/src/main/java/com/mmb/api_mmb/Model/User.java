package com.mmb.api_mmb.Model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_user")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "tipo_usuario", discriminatorType = DiscriminatorType.STRING)
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String nome;

    private String token;

    private String tokenRecuperacao;

    private LocalDateTime dataExpiracaoToken;

    @Column(nullable = false, unique = true)
    private String cpf;

    private String telefone;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    private LocalDateTime dataDelecao;

    // Método do ciclo de vida do JPA para setar a data de criação automaticamente antes de salvar
    @PrePersist
    protected void onCreate() {
        this.dataCriacao = LocalDateTime.now();
    }
}