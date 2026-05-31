package com.mmb.api_mmb.Model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;

@Entity
@DiscriminatorValue("DEBITO")
@Data
@EqualsAndHashCode(callSuper = true)
public class CartaoDebito extends Cartao {
    // Débito não tem limite, herda apenas o básico
}