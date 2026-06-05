import React, { useState } from 'react';
import './Transferencias.css';

type ContatoPix = {
  id: number;
  nome: string;
  tipo: 'pix';
  chave: string;
  iniciais: string;
  cor: string;
};

type ContatoTed = {
  id: number;
  nome: string;
  tipo: 'ted';
  cpfCnpj: string;
  banco: string;
  agencia: string;
  conta: string;
  iniciais: string;
  cor: string;
};

// --- Mocks de Dados ---
type Contato = ContatoPix | ContatoTed;

// --- Mocks de Dados ---
const contatosRecentes: Contato[] = [
  {
    id: 1,
    nome: 'Ana Costa',
    tipo: 'pix',
    chave: 'ana@email.com',
    iniciais: 'AC',
    cor: '#3b82f6'
  },
  {
    id: 2,
    nome: 'Carlos Silva',
    tipo: 'pix',
    chave: '11999998888',
    iniciais: 'CS',
    cor: '#10b981'
  },
  {
    id: 3,
    nome: 'Empresa XYZ',
    tipo: 'ted',
    cpfCnpj: '12.345.678/0001-99',
    banco: '341',
    agencia: '1234',
    conta: '56789-0',
    iniciais: 'EX',
    cor: '#8b5cf6'
  },
  {
    id: 4,
    nome: 'João Souza',
    tipo: 'pix',
    chave: 'joao.souza@pix',
    iniciais: 'JS',
    cor: '#f59e0b'
  }
];

export const Transferencias: React.FC = () => {
  const [metodo, setMetodo] = useState<'pix' | 'ted'>('pix');
  const [contatoSelecionado, setContatoSelecionado] = useState<number | null>(null);
  const [valor, setValor] = useState<string>('');
  const [tipoEnvio, setTipoEnvio] = useState<'agora' | 'agendado'>('agora');


  //
  const [chavePix, setChavePix] = useState('');
  const [banco, setBanco] = useState('');
  const [agencia, setAgencia] = useState('');
  const [conta, setConta] = useState('');

  const handleContatoClick = (id: number) => {
    const contato = contatosRecentes.find(c => c.id === id);

    if (!contato) return;

    setContatoSelecionado(id);

    if (contato.tipo === 'pix') {
      setMetodo('pix');
      setChavePix(contato.chave);

      // limpa dados TED
      setBanco('');
      setAgencia('');
      setConta('');
    } else {
      setMetodo('ted');
      setChavePix(contato.cpfCnpj);
      setBanco(contato.banco);
      setAgencia(contato.agencia);
      setConta(contato.conta);
    }
  };

  const handleTransferir = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valor || valor === '0' || valor === '0,00') {
      alert('Por favor, insira um valor válido.');
      return;
    }
    alert(`Transferência via ${metodo.toUpperCase()} no valor de R$ ${valor} enviada para processamento!`);
  };

  return (
    <div className="transferencias-container">
      <header className="transferencias-header">
        <h1>Transferências</h1>
        <p>Envie dinheiro de forma instantânea e segura.</p>
      </header>

      <div className="transfer-content-grid">
        
        {/* COLUNA ESQUERDA: Opções e Contatos */}
        <div className="transfer-options-panel">
          
          {/* Toggle Pix / TED */}
          <div className="method-selector-card">
            <h3>Método de Envio</h3>
            <div className="segmented-control">
              <button 
                className={metodo === 'pix' ? 'active pix-active' : ''} 
                onClick={() => setMetodo('pix')}
              >
                <span className="method-icon">💠</span> Pix
              </button>
              <button 
                className={metodo === 'ted' ? 'active ted-active' : ''} 
                onClick={() => setMetodo('ted')}
              >
                <span className="method-icon">🏦</span> TED
              </button>
            </div>
            <p className="method-hint">
              {metodo === 'pix' 
                ? 'Transferência instantânea, disponível 24/7 sem taxas.' 
                : 'Transferência agendada para dias úteis (8h às 17h). Sujeito a taxas.'}
            </p>
          </div>

          {/* Contatos Recentes */}
          <div className="recent-contacts-card">
            <div className="card-header-simple">
              <h3>Contatos Recentes</h3>
              <button className="btn-text">Ver todos</button>
            </div>
            <div className="contacts-list">
              {contatosRecentes.map(contato => (
                <div 
                  key={contato.id} 
                  className={`contact-item ${contatoSelecionado === contato.id ? 'selected' : ''}`}
                  onClick={() => handleContatoClick(contato.id)}
                >
                  <div className="contact-avatar" style={{ backgroundColor: contato.cor }}>
                    {contato.iniciais}
                  </div>
                  <div className="contact-info">
                    <h4>{contato.nome}</h4>
                    <span>
                      {contato.tipo === 'pix'
                        ? contato.chave
                        : contato.cpfCnpj}
                    </span>
                  </div>
                  <div className="contact-check">
                    {contatoSelecionado === contato.id && '✓'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: Formulário de Envio */}
        <div className="transfer-form-panel">
          <form className="transfer-form-card" onSubmit={handleTransferir}>
            
            <div className="amount-input-group">
              <label>Valor da Transferência</label>
              <div className="amount-wrapper">
                <span className="currency-symbol">R$</span>
                <input 
                  type="number" 
                  placeholder="0,00" 
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <span className="balance-hint">Saldo disponível: <strong>R$ 24.780,50</strong></span>
            </div>

            <div className="form-fields">
              <div className="input-block">
                <label>{metodo === 'pix' ? 'Chave Pix' : 'CPF/CNPJ do Favorecido'}</label>
                <input
                  type="text"
                  value={chavePix}
                  onChange={(e) => setChavePix(e.target.value)}
                  placeholder={
                    metodo === 'pix'
                      ? 'E-mail, CPF, Telefone ou Aleatória'
                      : '000.000.000-00'
                  }
                  required
                />
              </div>

              {metodo === 'ted' && (
                <div className="bank-details-row">
                  <div className="input-block">
                    <label>Banco</label>
                    <select value={banco} onChange={(e) => setBanco(e.target.value)} required>
                      <option value="">Selecione</option>
                      <option value="001">Banco do Brasil</option>
                      <option value="033">Santander</option>
                      <option value="104">Caixa Econômica</option>
                      <option value="237">Bradesco</option>
                      <option value="341">Itaú</option>
                    </select>
                  </div>
                  <div className="input-block">
                    <label>Agência</label>
                    <input type="text"
                      value={agencia}
                      onChange={(e) => setAgencia(e.target.value)}
                      placeholder="0000"
                      required
                    />
                  </div>
                  <div className="input-block">
                    <label>Conta</label>
                    <input 
                      type="text"
                      value={conta}
                      onChange={(e) => setConta(e.target.value)}
                      placeholder="00000-0"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="input-block">
                <label>Quando enviar?</label>
                <select
                  value={tipoEnvio}
                  onChange={(e) => setTipoEnvio(e.target.value as 'agora' | 'agendado')}
                >
                  <option value="agora">Enviar agora</option>
                  <option value="agendado">Agendar</option>
                </select>
              </div>
                        
              {tipoEnvio === 'agendado' && (
                <div className="input-block">
                  <label>Data de Pagamento</label>
                  <input type="date" required />
                </div>
              )}

              <div className="input-block">
                <label>Descrição (Opcional)</label>
                <input type="text" placeholder="Ex: Aluguel, Rachar pizza..." maxLength={140} />
              </div>
            </div>

            <button type="submit" className="btn-submit-transfer">
              Revisar Transferência
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};