package br.uff.ic.mmbank.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "administradores")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class Administrador extends Usuario {

    @Column(unique = true, nullable = false)
    private String matricula;

    private String cargo;

    private String departamento;
}