package br.uff.ic.mmbank.mapper;

import br.uff.ic.mmbank.dto.ContaDto.ContaResponseDto;
import br.uff.ic.mmbank.model.Conta;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ContaMapper {

    @Mapping(source = "cliente.id", target = "clienteId")
    @Mapping(source = "cliente.nome", target = "nomeCliente")
    ContaResponseDto toResponseDto(Conta conta);
}