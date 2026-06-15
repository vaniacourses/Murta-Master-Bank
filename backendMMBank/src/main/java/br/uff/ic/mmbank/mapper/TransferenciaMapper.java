package br.uff.ic.mmbank.mapper;

import br.uff.ic.mmbank.dto.TransferenciaDto.TransferenciaResponseDto;
import br.uff.ic.mmbank.model.Transacao;
import br.uff.ic.mmbank.model.Transferencia;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Mapper(componentModel = "spring")
public interface TransferenciaMapper {

    @Mapping(source = "transferencia.id", target = "id")
    @Mapping(source = "transferencia.contaOrigem.numeroConta", target = "numeroContaOrigem")
    @Mapping(source = "transferencia.contaDestino.numeroConta", target = "numeroContaDestino")
    @Mapping(target = "valor", source = "valorTransferencia")
    @Mapping(target = "data", expression = "java(extrairData(transferencia))")
    @Mapping(source = "transferencia.chavePixUtilizada", target = "chavePixUtilizada")
    @Mapping(source = "transferencia.cpfCnpjFavorecido", target = "cpfCnpjFavorecido")
    @Mapping(source = "transferencia.bancoFavorecido", target = "bancoFavorecido")
    @Mapping(source = "transferencia.agenciaFavorecida", target = "agenciaFavorecida")
    @Mapping(source = "transferencia.contaFavorecida", target = "contaFavorecida")
    @Mapping(source = "transferencia.contaDestino.cliente.nome", target = "nomeFavorecido")
    TransferenciaResponseDto toResponseDto(Transferencia transferencia, BigDecimal valorTransferencia);

    default TransferenciaResponseDto toResponseDto(Transferencia transferencia) {
        BigDecimal valorCalculado = transferencia.getTransacoes().stream()
                .map(Transacao::getValor)
                .filter(v -> v.compareTo(BigDecimal.ZERO) > 0)
                .findFirst()
                .orElse(BigDecimal.ZERO);

        return toResponseDto(transferencia, valorCalculado);
    }

    default LocalDateTime extrairData(Transferencia tf) {
        if (tf.getTransacoes() == null || tf.getTransacoes().isEmpty()) {
            return LocalDateTime.now();
        }
        return tf.getTransacoes().get(0).getData();
    }
}