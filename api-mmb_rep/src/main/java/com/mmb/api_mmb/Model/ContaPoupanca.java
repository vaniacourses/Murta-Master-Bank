package com.mmb.api_mmb.Model;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;


@Entity
@DiscriminatorValue("POUPANCA")
@Data
@EqualsAndHashCode(callSuper = true)
public class ContaPoupanca extends Conta {
    //adicionar atributo se necessário

}