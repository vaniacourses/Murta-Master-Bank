package br.uff.ic.mmbank.mapper;

import br.uff.ic.mmbank.dto.EmprestimoResponseDto;
import br.uff.ic.mmbank.dto.ParcelaResponseDto;
import br.uff.ic.mmbank.model.Emprestimo;
import br.uff.ic.mmbank.model.Parcela;
import br.uff.ic.mmbank.model.Usuario;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

import java.util.List;


@Component
public class EmprestimoMapper {

    public EmprestimoResponseDto toResponseDto(Emprestimo emprestimo) {

        List<ParcelaResponseDto> parcelas =
                emprestimo.getParcelas()
                        .stream()
                        .map(this::toParcelaDto)
                        .toList();

        return new EmprestimoResponseDto(
                emprestimo.getId(),
                emprestimo.getValorTotal(),
                emprestimo.getTaxaJuros(),
                emprestimo.getQuantidadeParcelas(),
                emprestimo.getDataInicio(),
                emprestimo.getStatus(),
                parcelas
        );
    }

    private ParcelaResponseDto toParcelaDto(Parcela parcela) {

        return new ParcelaResponseDto(
                parcela.getId(),
                parcela.getNumero(),
                parcela.getValor(),
                parcela.getDataVencimento(),
                parcela.getDataPagamento(),
                parcela.getStatus()
        );
    }
}