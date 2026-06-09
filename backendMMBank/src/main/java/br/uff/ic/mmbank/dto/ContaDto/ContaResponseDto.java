package br.uff.ic.mmbank.dto.ContaDto;

import br.uff.ic.mmbank.model.enums.StatusConta;
import br.uff.ic.mmbank.model.enums.TipoConta;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ContaResponseDto(
   Long id,
   String numeroConta,
   BigDecimal saldo,
   TipoConta tipoConta,
   StatusConta statusConta,
   LocalDateTime dataCriacao,
   Long clienteId,
   String nomeCliente
) {}
