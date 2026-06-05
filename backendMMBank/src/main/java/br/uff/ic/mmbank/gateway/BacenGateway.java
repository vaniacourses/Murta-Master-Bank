package br.uff.ic.mmbank.gateway;

import br.uff.ic.mmbank.dto.BacenDto.PixConsultaChaveResponseDto;
import br.uff.ic.mmbank.dto.BacenDto.PixTransferenciaRequestDto;
import br.uff.ic.mmbank.dto.BacenDto.PixTransferenciaResponseDto;

public interface BacenGateway {

    PixConsultaChaveResponseDto consultarChave(String chave);

    PixTransferenciaResponseDto enviarOrdemPagamento(PixTransferenciaRequestDto request);
}
