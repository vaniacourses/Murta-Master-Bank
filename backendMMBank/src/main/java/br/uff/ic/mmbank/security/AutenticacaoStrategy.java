package br.uff.ic.mmbank.security;

import br.uff.ic.mmbank.dto.AutenticacaoRequestDto;

public interface AutenticacaoStrategy {

    String autenticar(AutenticacaoRequestDto dto);

}