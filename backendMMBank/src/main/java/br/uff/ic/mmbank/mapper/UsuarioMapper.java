package br.uff.ic.mmbank.mapper;

import br.uff.ic.mmbank.dto.UsuarioResponseDto;
import br.uff.ic.mmbank.model.Administrador;
import br.uff.ic.mmbank.model.Cliente;
import br.uff.ic.mmbank.model.Usuario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.SubclassMapping;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    @SubclassMapping(source = Cliente.class, target = UsuarioResponseDto.class)
    @SubclassMapping(source = Administrador.class, target = UsuarioResponseDto.class)
    UsuarioResponseDto toResponseDto(Usuario usuario);

    UsuarioResponseDto toResponseDto(Cliente cliente);

    @Mapping(target = "documento", ignore = true)
    @Mapping(target = "telefone", ignore = true)
    UsuarioResponseDto toResponseDto(Administrador administrador);

}