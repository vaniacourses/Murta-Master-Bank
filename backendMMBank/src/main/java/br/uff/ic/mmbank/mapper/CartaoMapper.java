package br.uff.ic.mmbank.mapper;

import br.uff.ic.mmbank.dto.CartaoDto.CartaoResponseDto;
import br.uff.ic.mmbank.dto.CartaoDto.TransacaoResumoDto;
import br.uff.ic.mmbank.model.Cartao;
import br.uff.ic.mmbank.model.Transacao;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CartaoMapper {

    @Mapping(source = "conta.id", target = "contaId")
    CartaoResponseDto toCartaoResponseDto(Cartao cartao);

    List<CartaoResponseDto> toCartaoResponseDtoList(List<Cartao> cartoes);

    TransacaoResumoDto toTransacaoResumoDto(Transacao transacao);

    List<TransacaoResumoDto> toTransacaoResumoDtoList(List<Transacao> transacoes);
}