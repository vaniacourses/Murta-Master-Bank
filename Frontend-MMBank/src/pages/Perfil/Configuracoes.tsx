import React, { useState, useRef, useEffect } from 'react';
import { api } from '../../service/api';
import { useAuth } from '../../hooks/auth/useAuth'; 
import './Configuracoes.css';

interface IUsuarioProps {
  nome: string;
  documento: string; // CPF ou CNPJ
  email: string;
  telefone: string;
  endereco: string
}

export const Configuracoes: React.FC = () => {
  const { utilizador } = useAuth();
  // Mock dos dados do usuário logado
  const [usuario, setUsuario] = useState<IUsuarioProps>({
    nome: utilizador?.nome || '',
    documento: utilizador?.cpf || '', // o useLogin guarda o documento na chave cpf
    email: utilizador?.email || '',
    telefone: utilizador?.telefone || '',
    endereco: utilizador?.endereco || ''
  });

  useEffect(() => {
    if (utilizador) {
      setUsuario(prev => ({
        ...prev,
        nome: utilizador.nome,
        documento: utilizador.cpf || '',
        email: utilizador.email,
        telefone: utilizador.telefone || '',
        endereco: utilizador.endereco || ''
      }));
    }
  }, [utilizador]);


  const [senhas, setSenhas] = useState({
    atual: '',
    nova: '',
    confirmacao: ''
  });

  // Estado e referência para a foto de perfil
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUsuario(prev => ({ ...prev, [name]: value }));
  };

  const handleSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSenhas(prev => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Cria uma URL temporária para mostrar o preview da imagem
      const fotoUrl = URL.createObjectURL(file);
      setFotoPerfil(fotoUrl);
    }
  };

const handleSalvarDados = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!utilizador || !utilizador.id) {
      alert("Erro: Não foi possível identificar o usuário logado.");
      return;
    }

    try {
      const payload = {
        telefone: usuario.telefone,
        endereco: usuario.endereco
      };

      const response = await api.put(`/clientes/${utilizador.id}`, payload);

      if (response.status === 200) {
        alert('Dados atualizados com sucesso!');
        window.location.reload(); 
      }
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
      alert('Falha ao salvar as alterações. Verifique se o servidor está rodando.');
    }
  };

  const handleAtualizarSenha = (e: React.FormEvent) => {
    e.preventDefault();
    if (senhas.nova !== senhas.confirmacao) {
      alert('A nova senha e a confirmação não coincidem.');
      return;
    }
    if (senhas.nova.length < 6) {
      alert('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    alert('Senha atualizada com sucesso!');
    setSenhas({ atual: '', nova: '', confirmacao: '' });
  };

  // Pega as iniciais do nome caso não tenha foto
  const iniciaisNome = usuario.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="configuracoes-container">
      <header className="configuracoes-header">
        <h1>Configurações da Conta</h1>
        <p>Mantenha seus dados pessoais, foto e segurança sempre atualizados.</p>
      </header>

      <div className="configuracoes-grid">
        
        {/* Painel Esquerdo: Dados Pessoais e Endereço */}
        <div className="config-principal">
          <form className="card-box" onSubmit={handleSalvarDados}>
            
            {/* NOVO: Seção Foto de Perfil */}
            <div className="perfil-foto-section">
              <div className="foto-wrapper">
                {fotoPerfil ? (
                  <img src={fotoPerfil} alt="Perfil" className="foto-imagem" />
                ) : (
                  <div className="foto-placeholder">{iniciaisNome}</div>
                )}
                
                <button 
                  type="button" 
                  className="btn-alterar-foto" 
                  onClick={() => fileInputRef.current?.click()}
                  title="Alterar Foto"
                >
                  📷
                </button>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handleFotoChange} 
                  style={{ display: 'none' }} 
                />
              </div>
              <div className="foto-info">
                <h3>Sua Foto de Perfil</h3>
                <p>Formatos suportados: JPG, PNG ou GIF. Tamanho máximo: 2MB.</p>
                {fotoPerfil && (
                  <button type="button" className="btn-remover-foto" onClick={() => setFotoPerfil(null)}>
                    Remover foto
                  </button>
                )}
              </div>
            </div>

            <hr className="divider" />

            {/* Seção Dados Pessoais */}
            <div className="form-section">
              <h3>Dados Pessoais</h3>
              <div className="form-row">
                <div className="input-group">
                  <label>Nome Completo</label>
                  <input type="text" name="nome" value={usuario.nome} disabled className="input-disabled" title="Para alterar seu nome, contate o suporte." />
                </div>
                <div className="input-group">
                  <label>Documento (CPF/CNPJ)</label>
                  <input type="text" name="documento" value={usuario.documento} disabled className="input-disabled" />
                </div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>E-mail</label>
                  <input type="email" name="email" value={usuario.email} onChange={handleInputChange} required />
                </div>
                <div className="input-group">
                  <label>Telefone / Celular</label>
                  <input type="tel" name="telefone" value={usuario.telefone} onChange={handleInputChange} required />
                </div>
              </div>
            </div>

            <hr className="divider" />

            {/* Seção Endereço */}
            <div className="form-section">
              <h3>Endereço</h3>
              <div className="form-row">
                <div className="input-group full-width">
                  <label>Endereço Completo</label>
                  <input 
                    type="text" 
                    name="endereco" 
                    value={usuario.endereco} 
                    onChange={handleInputChange} 
                    placeholder="Rua, Número, Bairro, Cidade - UF, CEP" 
                    required 
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">Salvar Alterações</button>
            </div>
          </form>
        </div>

        {/* Painel Direito: Segurança */}
        <div className="config-seguranca">
          <form className="card-box" onSubmit={handleAtualizarSenha}>
            <h3>Segurança e Acesso</h3>
            <p className="section-desc">Atualize sua senha de acesso ao aplicativo regularmente para manter sua conta segura.</p>
            
            <div className="form-section">
              <div className="input-group">
                <label>Senha Atual</label>
                <input type="password" name="atual" value={senhas.atual} onChange={handleSenhaChange} required placeholder="••••••••" />
              </div>
              <div className="input-group mt-3">
                <label>Nova Senha</label>
                <input type="password" name="nova" value={senhas.nova} onChange={handleSenhaChange} required placeholder="••••••••" />
              </div>
              <div className="input-group mt-3">
                <label>Confirmar Nova Senha</label>
                <input type="password" name="confirmacao" value={senhas.confirmacao} onChange={handleSenhaChange} required placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" className="btn-danger mt-4">Atualizar Senha</button>
          </form>
        </div>

      </div>
    </div>
  );
};