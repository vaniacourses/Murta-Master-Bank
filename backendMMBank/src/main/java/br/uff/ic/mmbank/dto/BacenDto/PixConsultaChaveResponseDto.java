package br.uff.ic.mmbank.dto.BacenDto;

public record PixConsultaChaveResponseDto(
        boolean encontrada,
        String chave,
        String tipoChave,
        String agencia,
        String numeroConta,
        String banco) {
}
