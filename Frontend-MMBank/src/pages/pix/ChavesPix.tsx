import React, { useState } from 'react';
import './ChavesPix.css';

// Tipagens baseadas no Diagrama de Classes
type TipoChave = 'CPF' | 'CNPJ' | 'EMAIL' | 'TELEFONE' | 'ALEATORIA';

interface IChavePix {
  id: number;
  tipo: TipoChave;
  valor: string;
  dataCriacao: string;
  ativa: boolean;
}

// Mocks iniciais
const chavesMock: IChavePix[] = [
  { id: 1, tipo: 'CPF', valor: '123.456.789-00', dataCriacao: '2025-01-15', ativa: true },
  { id: 2, tipo: 'EMAIL', valor: 'gustavo.murta@email.com', dataCriacao: '2025-03-20', ativa: true },
];

export const ChavesPix: React.FC = () => {
  const [chaves, setChaves] = useState<IChavePix[]>(chavesMock);
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoChave>('CPF');
  const [valorChave, setValorChave] = useState('');

  // Lógica de cadastro de nova chave
  const handleCadastrarChave = (e: React.FormEvent) => {
    e.preventDefault();

    let valorFinal = valorChave;

    // Se for aleatória, o sistema gera o UUID (simulado aqui)
    if (tipoSelecionado === 'ALEATORIA') {
      valorFinal = crypto.randomUUID ? crypto.randomUUID() : 'b4a83b22-8d9e-4e5f-a7b1-2c3d4e5f6g7h';
    } else if (!valorFinal) {
      alert('Por favor, preencha o valor da chave.');
      return;
    }

    const novaChave: IChavePix = {
      id: Math.floor(Math.random() * 10000),
      tipo: tipoSelecionado,
      valor: valorFinal,
      dataCriacao: new Date().toISOString().split('T')[0],
      ativa: true
    };

    setChaves([...chaves, novaChave]);
    setValorChave(''); // Reseta o campo
    alert(`Chave ${tipoSelecionado} cadastrada com sucesso!`);
  };

  // Método equivalente ao + inativar(): void do diagrama
  const handleInativarChave = (id: number) => {
    const confirmar = window.confirm('Tem certeza que deseja excluir (inativar) esta chave?');
    if (confirmar) {
      setChaves(chaves.map(c => c.id === id ? { ...c, ativa: false } : c));
    }
  };

  // Filtra apenas as chaves ativas para exibição
  const chavesAtivas = chaves.filter(c => c.ativa);

  // Helper para placeholders e labels dinâmicos
  const getDadosInput = () => {
    switch (tipoSelecionado) {
      case 'CPF': return { label: 'Número do CPF', placeholder: '000.000.000-00', type: 'text' };
      case 'CNPJ': return { label: 'Número do CNPJ', placeholder: '00.000.000/0000-00', type: 'text' };
      case 'EMAIL': return { label: 'Endereço de E-mail', placeholder: 'seu@email.com', type: 'email' };
      case 'TELEFONE': return { label: 'Número de Celular', placeholder: '(00) 90000-0000', type: 'tel' };
      case 'ALEATORIA': return { label: 'Chave Aleatória', placeholder: 'Gerada automaticamente pelo sistema', type: 'text', disabled: true };
      default: return { label: 'Valor da Chave', placeholder: '', type: 'text' };
    }
  };

  const inputConfig = getDadosInput();

  return (
    <div className="chaves-pix-container">
      <header className="chaves-header">
        <h1>Minhas Chaves Pix</h1>
        <p>Gerencie as chaves vinculadas à sua conta para receber transferências.</p>
      </header>

      <div className="chaves-content-grid">
        
        {/* Painel de Cadastro de Nova Chave */}
        <div className="nova-chave-panel">
          <form className="nova-chave-form card-box" onSubmit={handleCadastrarChave}>
            <h3>Cadastrar Nova Chave</h3>
            
            <div className="input-group">
              <label>Tipo de Chave</label>
              <select 
                value={tipoSelecionado} 
                onChange={(e) => {
                  setTipoSelecionado(e.target.value as TipoChave);
                  setValorChave(''); // Limpa o input ao trocar de tipo
                }}
              >
                <option value="CPF">CPF</option>
                <option value="CNPJ">CNPJ</option>
                <option value="EMAIL">E-mail</option>
                <option value="TELEFONE">Celular</option>
                <option value="ALEATORIA">Chave Aleatória</option>
              </select>
            </div>

            <div className="input-group">
              <label>{inputConfig.label}</label>
              <input 
                type={inputConfig.type} 
                placeholder={inputConfig.placeholder}
                value={valorChave}
                onChange={(e) => setValorChave(e.target.value)}
                disabled={inputConfig.disabled}
                className={inputConfig.disabled ? 'input-disabled' : ''}
              />
            </div>

            <button type="submit" className="btn-submit-chave">
              {tipoSelecionado === 'ALEATORIA' ? 'Gerar Chave Aleatória' : 'Cadastrar Chave'}
            </button>
          </form>
        </div>

        {/* Lista de Chaves Ativas */}
        <div className="lista-chaves-panel">
          <div className="card-box">
            <h3>Chaves Ativas</h3>
            
            {chavesAtivas.length === 0 ? (
              <p className="empty-state">Você não possui chaves Pix ativas.</p>
            ) : (
              <div className="chaves-list">
                {chavesAtivas.map(chave => (
                  <div key={chave.id} className="chave-item">
                    <div className="chave-icon">
                      {chave.tipo === 'EMAIL' && '✉️'}
                      {chave.tipo === 'TELEFONE' && '📱'}
                      {chave.tipo === 'ALEATORIA' && '🔀'}
                      {(chave.tipo === 'CPF' || chave.tipo === 'CNPJ') && '📄'}
                    </div>
                    <div className="chave-info">
                      <span className="chave-tipo">{chave.tipo}</span>
                      <strong className="chave-valor">{chave.valor}</strong>
                      <span className="chave-data">Criada em: {new Date(chave.dataCriacao).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <button 
                      onClick={() => handleInativarChave(chave.id)} 
                      className="btn-delete-chave"
                      title="Excluir Chave"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};