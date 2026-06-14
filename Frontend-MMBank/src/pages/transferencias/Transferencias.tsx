import React, { useEffect, useState } from 'react';
import './Transferencias.css';
import { transferenciaService } from '../../service/tranferenciaService';
import type { TransferenciaResponseDTO } from '../../types/dtos';
import { api } from '../../service/api';

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

type Contato = ContatoPix | ContatoTed;


export const Transferencias: React.FC = () => {
  const [metodo, setMetodo] = useState<'pix' | 'ted'>('pix');
  const [contatoSelecionado, setContatoSelecionado] = useState<number | null>(null);
  const [valor, setValor] = useState<string>('');
  const [tipoEnvio, setTipoEnvio] = useState<'agora' | 'agendado'>('agora');
  const [isLoading, setIsLoading] = useState(false);


  //
  const [chavePix, setChavePix] = useState('');
  const [banco, setBanco] = useState('');
  const [agencia, setAgencia] = useState('');
  const [conta, setConta] = useState('');
  const [comprovante, setComprovante] = useState<TransferenciaResponseDTO | null>(null);
  const [descricao, setDescricao] = useState('');
  const [saldoAtual, setSaldoAtual] = useState<number>(0);
  const [contaOrigemId, setContaOrigemId] = useState<number>(0);
  const [atualizador, setAtualizador] = useState<number>(0);
  const [contatosRecentes, setContatosRecentes] = useState<Contato[]>([]);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const resConta = await api.get('/contas/minha');
        const idConta = resConta.data.id;
        setSaldoAtual(resConta.data.saldo);
        setContaOrigemId(idConta);

        const resTransf = await api.get(`/transferencias/conta/${idConta}`);
        const historico = resTransf.data;

        const contatosUnicos: Contato[] = [];
        const chavesVistas = new Set();

        historico.reverse().forEach((t: TransferenciaResponseDTO) => {
          const identificador = t.chavePixUtilizada || t.contaFavorecida || t.numeroContaDestino;

          if (identificador && !chavesVistas.has(identificador)) {
            chavesVistas.add(identificador);
            
            if (t.chavePixUtilizada) {
              contatosUnicos.push({
                id: t.id,
                nome: 'Contato Pix',
                tipo: 'pix',
                chave: t.chavePixUtilizada,
                iniciais: 'PX',
                cor: '#3b82f6'
              });
            } else if (t.bancoFavorecido || t.numeroContaDestino) {
              contatosUnicos.push({
                id: t.id,
                nome: t.bancoFavorecido || 'Conta Interna',
                tipo: 'ted',
                cpfCnpj: t.cpfCnpjFavorecido || '',
                banco: t.bancoFavorecido || 'MMBank',
                agencia: t.agenciaFavorecida || '0001',
                conta: t.contaFavorecida || t.numeroContaDestino || '',
                iniciais: 'TD',
                cor: '#10b981'
              });
            }
          }
        });

        setContatosRecentes(contatosUnicos.slice(0, 4));

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    carregarDados();
  }, [atualizador]);

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

  const handleTransferir = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const valorConvertido = parseFloat(valor.replace(',', '.'));

    if (!valorConvertido || valorConvertido <= 0) {
      alert('Por favor, insira um valor válido maior que zero.');
      return;
    }

    setIsLoading(true);

    try {

      const dadosEnvio = {
        contaOrigemId: contaOrigemId,
        contaDestinoId: null,
        valor: valorConvertido,
        chavePix: metodo === 'pix' ? chavePix : undefined,
        cpfCnpj: metodo === 'ted' ? chavePix : undefined,
        banco: metodo === 'ted' ? banco : undefined,
        agencia: metodo === 'ted' ? agencia : undefined,
        conta: metodo === 'ted' ? conta : undefined,
        tipoEnvio: tipoEnvio,
        descricao: descricao
      };

      let resposta;
      if (metodo === 'pix') {
        resposta = await transferenciaService.realizarPix(dadosEnvio);
      } else {
        resposta = await transferenciaService.realizar(dadosEnvio);
      }

      setComprovante(resposta);
      setAtualizador(prev => prev + 1);
      
    } catch (error) {
      console.error(error);
      alert('Erro na transferência. Verifique se você tem saldo e se o ID de destino existe!');
    } finally {
      setIsLoading(false);
    }
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
          {comprovante ? (
            <div className="transfer-form-card" style={{ textAlign: 'center' }}>
              <h2 style={{ color: '#10b981' }}>Transferência Realizada!</h2>
              <br/>
              <div style={{ backgroundColor: '#f3f4f6', padding: '20px', borderRadius: '8px', textAlign: 'left' }}>
                <p><strong>ID do Comprovante:</strong> {comprovante.id}</p>
                <p><strong>Data:</strong> {new Date(comprovante.data).toLocaleString()}</p>
                <p><strong>Valor:</strong> R$ {comprovante.valor.toFixed(2)}</p>
                <p><strong>Sua Conta:</strong> {comprovante.numeroContaOrigem}</p>
                <p><strong>Conta Destino:</strong> {comprovante.numeroContaDestino}</p>
              </div>
              <br/>
              <button 
                className="btn-submit-transfer" 
                onClick={() => {
                  setComprovante(null);
                  setValor('');
                }}>
                Fazer nova transferência
              </button>
            </div>
          ) : (
            <form className="transfer-form-card" onSubmit={handleTransferir}>
              
              <div className="amount-input-group">
                <label>Valor da Transferência</label>
                <div className="amount-wrapper">
                  <span className="currency-symbol">R$</span>
                  <input 
                    type="text" 
                    placeholder="0,00" 
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    required
                  />
                </div>
                <span className="balance-hint">
                  Saldo disponível: <strong>
                    {saldoAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </strong>
                </span>
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
                        <option value="MMBank">MMBank</option>
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
                  <input type="text" placeholder="Ex: Aluguel, Rachar pizza..."
                  maxLength={140} 
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn-submit-transfer" disabled={isLoading}>
                {isLoading ? 'Processando...' : 'Revisar Transferência'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};