import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCadastro } from '../../hooks/auth/useCadastro'; 
import './Cadastro.css';

export const Cadastro: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  const { cadastrar, isLoading, error } = useCadastro();

  const [formData, setFormData] = useState({
    nome: '',
    documento: '', 
    dataNascimento: '',
    email: '',
    telefone: '',
    endereco: '',
    senha: '',
    confirmarSenha: '',
    genero: '',
    profissao: '',
    rendaMensal: 0,
    role: 'ROLE_USER'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      //validacao de segurança basica
      if (formData.senha !== formData.confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
      }

      // prepara o objeto para enviar tirando a confirmarSenha que o Back não precisa
      const payload = {
        nome: formData.nome,
        documento: formData.documento,
        dataNascimento: formData.dataNascimento,
        email: formData.email,
        telefone: formData.telefone,
        endereco: formData.endereco,
        senha: formData.senha,
        genero: formData.genero,
        profissao: formData.profissao,
        rendaMensal: formData.rendaMensal,
        role: formData.role
      };

      const sucesso = await cadastrar(payload);

      if (sucesso) {
        alert('Conta criada com sucesso!');
        navigate('/login');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        
        {/* Cabeçalho do Formulário */}
        <div className="cadastro-header">
          <h2>Abra sua Conta</h2>
          <p className="login-link">
            Já é cliente? <span onClick={() => navigate('/login')}>Faça login</span>
          </p>
        </div>

        {/* Stepper Progressão */}
        <div className="stepper-container">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-circle">1</div>
            <span>Dados Pessoais</span>
          </div>
          <div className={`step-line ${currentStep >= 2 ? 'active' : ''}`}></div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-circle">2</div>
            <span>Contato</span>
          </div>
          <div className={`step-line ${currentStep >= 3 ? 'active' : ''}`}></div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-circle">3</div>
            <span>Verificação</span>
          </div>
        </div>

        {/* Área do Formulário */}
        <form className="cadastro-form" onSubmit={handleNext}>
          
          {/* ETAPA 1: Dados Pessoais */}
          {currentStep === 1 && (
            <div className="form-step slide-in">
              <div className="input-group full-width">
                <label>Nome Completo</label>
                <input type="text" name="nome" value={formData.nome} onChange={handleChange} placeholder="Digite seu nome completo" required />
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>CPF</label>
                  <input type="text" name="documento" value={formData.documento} onChange={handleChange} placeholder="000.000.000-00" required />
                </div>
                <div className="input-group">
                  <label>Data de Nascimento</label>
                  <input type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} required />
                </div>
              </div>
              <div className="input-group radio-group">
                <label>Gênero</label>
                <div className="radio-options">
                  <label><input type="radio" name="genero" value="m" checked={formData.genero === 'm'} onChange={handleChange} /> Masculino</label>
                  <label><input type="radio" name="genero" value="f" checked={formData.genero === 'f'} onChange={handleChange} /> Feminino</label>
                  <label><input type="radio" name="genero" value="o" checked={formData.genero === 'o'} onChange={handleChange} /> Outro</label>
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 2: Contato e Endereço */}
          {currentStep === 2 && (
            <div className="form-step slide-in">
              <div className="form-row">
                <div className="input-group">
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="seu@email.com" required />
                </div>
                <div className="input-group">
                  <label>Telefone / Celular</label>
                  <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(00) 00000-0000" required />
                </div>
              </div>
              <div className="input-group full-width">
                <label>Endereço Completo</label>
                <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} placeholder="Rua, Número, Bairro, Cidade - UF" required />
              </div>
              <div className="input-group full-width">
                <label>Profissão / Ocupação</label>
                <select name="profissao" value={formData.profissao} onChange={handleChange} required>
                  <option value="">- Selecione -</option>
                  <option value="assalariado">Assalariado</option>
                  <option value="autonomo">Autônomo</option>
                  <option value="empresario">Empresário</option>
                  <option value="estudante">Estudante</option>
                </select>
              </div>
            </div>
          )}

          {/* ETAPA 3: Verificação e Senha */}
          {currentStep === 3 && (
            <div className="form-step slide-in">
              <div className="photo-upload">
                <div className="upload-circle">📷</div>
                <span>Adicionar foto do documento</span>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Crie uma Senha</label>
                  <input type="password" name="senha" value={formData.senha} onChange={handleChange} placeholder="Mínimo 8 caracteres" required />
                </div>
                <div className="input-group">
                  <label>Confirme a Senha</label>
                  <input type="password" name="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange} placeholder="Repita sua senha" required />
                </div>
              </div>
              <div className="terms-group">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">Concordo com os Termos de Uso e Política de Privacidade (LGPD)</label>
              </div>
            </div>
          )}

          {/* Exibe o erro se o back-end rejeitar o cadastro */}
          {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{error}</p>}

          {/* Botões de Ação */}
          <div className="form-actions">
            {currentStep > 1 ? (
              <button type="button" className="btn-back" onClick={handleBack} disabled={isLoading}>
                Voltar
              </button>
            ) : (
              <div></div> /* Spacer para manter o alinhamento do flex */
            )}
            <button type="submit" className="btn-next" disabled={isLoading}>
              {isLoading ? 'Carregando...' : (currentStep === 3 ? 'Finalizar Cadastro' : 'Salvar e Continuar')}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};