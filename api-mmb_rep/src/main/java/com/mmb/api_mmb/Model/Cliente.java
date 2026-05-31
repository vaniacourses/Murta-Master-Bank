package com.mmb.api_mmb.Model;

import com.mmb.api_mmb.enums.TipoPessoa;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@DiscriminatorValue("CLIENTE") // Valor que será gravado na coluna tipo_usuario
@Data
@EqualsAndHashCode(callSuper = true) // Garante que o Lombok considere os atributos da classe mãe no equals/hashcode
@NoArgsConstructor
@AllArgsConstructor
public class Cliente extends User {

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_pessoa")
    private TipoPessoa tipoPessoa;
}