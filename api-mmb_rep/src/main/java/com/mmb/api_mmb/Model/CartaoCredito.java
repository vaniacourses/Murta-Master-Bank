package com.mmb.api_mmb.Model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;

@Entity
@DiscriminatorValue("CREDITO")
@Data
@EqualsAndHashCode(callSuper = true)
public class CartaoCredito extends Cartao {

    private BigDecimal limite; // Atributo exclusivo do cartão de crédito
}