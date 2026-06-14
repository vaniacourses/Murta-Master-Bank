package br.uff.ic.mmbank.factory;

import br.uff.ic.mmbank.dto.UsuarioRequestDto;
import br.uff.ic.mmbank.model.Administrador;
import br.uff.ic.mmbank.model.Cliente;
import br.uff.ic.mmbank.model.Usuario;
import br.uff.ic.mmbank.model.enums.UserRole;
import org.springframework.stereotype.Component;

@Component
public class UsuarioFactory {

    public Usuario criarUsuario(UsuarioRequestDto dto, String senhaCriptografada) {
        if (dto.role() == UserRole.ROLE_ADMIN) {
            Administrador admin = new Administrador();
            preencherDadosBasicos(admin, dto, senhaCriptografada);
            return admin;
        } else if (dto.role() == UserRole.ROLE_USER) {
            Cliente cliente = new Cliente();
            preencherDadosBasicos(cliente, dto, senhaCriptografada);
            cliente.setDocumento(dto.documento());
            cliente.setDataNascimento(dto.dataNascimento());
            cliente.setTelefone(dto.telefone());
            cliente.setEndereco(dto.endereco());
            cliente.setRendaMensal(dto.rendaMensal());
            cliente.setGenero(dto.genero());
            cliente.setProfissao(dto.profissao());
            return cliente;
        }
        throw new IllegalArgumentException("Role inválida");
    }

    private void preencherDadosBasicos(Usuario usuario, UsuarioRequestDto dto, String senhaCriptografada) {
        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());
        usuario.setSenha(senhaCriptografada);
        usuario.setRole(dto.role());
    }
}