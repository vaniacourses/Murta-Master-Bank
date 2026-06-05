import React, { useState, useRef } from 'react';
import './Configuracoes.css';

interface IUsuarioProps {
  nome: string;
  documento: string; // CPF ou CNPJ
  email: string;
  telefone: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export const Configuracoes: React.FC = () => {
  // Mock dos dados do usuário logado
  const [usuario, setUsuario] = useState<IUsuarioProps>({
    nome: 'Gustavo Trindade Murta',
    documento: '123.456.789-00',
    email: 'gustavo.murta@email.com',
    telefone: '(21) 99999-9999',
    cep: '24020-150',
    rua: 'Rua Passo da Pátria',
    numero: '156',
    complemento: 'Apto 202',
    bairro: 'São Domingos',
    cidade: 'Niterói',
    estado: 'RJ'
  });

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

  const handleSalvarDados = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Dados e foto atualizados com sucesso!');
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
                <div className="input-group">
                  <label>CEP</label>
                  <input type="text" name="cep" value={usuario.cep} onChange={handleInputChange} required />
                </div>
                <div className="input-group flex-2">
                  <label>Rua / Avenida</label>
                  <input type="text" name="rua" value={usuario.rua} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Número</label>
                  <input type="text" name="numero" value={usuario.numero} onChange={handleInputChange} required />
                </div>
                <div className="input-group flex-2">
                  <label>Complemento</label>
                  <input type="text" name="complemento" value={usuario.complemento} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Bairro</label>
                  <input type="text" name="bairro" value={usuario.bairro} onChange={handleInputChange} required />
                </div>
                <div className="input-group">
                  <label>Cidade</label>
                  <input type="text" name="cidade" value={usuario.cidade} onChange={handleInputChange} required />
                </div>
                <div className="input-group">
                  <label>Estado</label>
                  <input type="text" name="estado" value={usuario.estado} onChange={handleInputChange} required maxLength={2} />
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