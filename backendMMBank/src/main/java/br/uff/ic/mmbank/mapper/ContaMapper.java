package br.uff.ic.mmbank.mapper;

import br.uff.ic.mmbank.dto.ContaDto.ContaResponseDto;
import br.uff.ic.mmbank.model.Conta;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.math.BigDecimal;

@Mapper(componentModel = "spring")
public interface ContaMapper {

    // 1. Usado no buscarPorId do ContaService
    @Mapping(source = "conta.cliente.id", target = "clienteId")
    @Mapping(source = "conta.cliente.nome", target = "nomeCliente")
    @Mapping(source = "totalEntradas", target = "totalEntradas")
    @Mapping(source = "totalSaidas", target = "totalSaidas")
    ContaResponseDto toResponseDto(Conta conta, BigDecimal totalEntradas, BigDecimal totalSaidas);

    // 2. Usada no listarTodasContas (não calcula totais)
    @Mapping(source = "conta.cliente.id", target = "clienteId")
    @Mapping(source = "conta.cliente.nome", target = "nomeCliente")
    @Mapping(target = "totalEntradas", expression = "java(java.math.BigDecimal.ZERO)") // totalEntradas = 0
    @Mapping(target = "totalSaidas", expression = "java(java.math.BigDecimal.ZERO)")  // totalSaidas = 0
    ContaResponseDto toResponseDto(Conta conta);
}