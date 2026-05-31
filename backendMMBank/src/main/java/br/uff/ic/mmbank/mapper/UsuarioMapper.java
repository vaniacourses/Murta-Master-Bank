package br.uff.ic.mmbank.mapper;

import br.uff.ic.mmbank.dto.UsuarioResponseDto;
import br.uff.ic.mmbank.model.Usuario;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    UsuarioResponseDto toResponseDto(Usuario usuario);

}