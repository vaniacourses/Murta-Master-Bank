package br.uff.ic.mmbank.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "clientes")
@Data
@EqualsAndHashCode(callSuper = true) //para o Lombok respeitar a heranca de Usuario
@NoArgsConstructor
public class Cliente extends Usuario {

    @Column(unique = true, nullable = false)
    private String documento;

    private LocalDate dataNascimento;

    private String telefone;

    private String endereco;

    private BigDecimal rendaMensal;

    private String genero;

    private String profissao;
}