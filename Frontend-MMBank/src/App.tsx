import { useState } from 'react';
import './App.css';

function App() {
  const [showBalance, setShowBalance] = useState(true);

  // Dados mocados para exibição visual enquanto o Java não se conecta
  const user = {
    name: "Paulo Jorge",
    account: "Ag: 0001 | C/C: 123456-7",
    balance: 5432.10,
    creditCard: 1250.00,
    limit: 5000.00
  };

  const transactions = [
    { id: 1, type: "Transferência Recebida", name: "Gustavo Murta", value: 150.00, date: "Hoje", positive: true },
    { id: 2, type: "Pagamento de Parcela", name: "Empréstimo #1", value: -450.00, date: "Ontem", positive: false },
    { id: 3, type: "Transferência Enviada", name: "Henrique Grilo", value: -20.00, date: "23 Mai", positive: false },
    { id: 4, type: "Depósito", name: "Caixa Eletrônico", value: 1000.00, date: "20 Mai", positive: true },
  ];

  return (
    <div className="dashboard-container">
      {/* Barra Lateral (Sidebar) */}
      <aside className="sidebar">
        <div className="logo-area">
          <h2>MM<span>Bank</span></h2>
          <p>Murta Master Bank</p>
        </div>
        <nav className="menu">
          <a href="#home" className="active">🏠 Início</a>
          <a href="#transferir">💸 Transferências</a>
          <a href="#emprestimos">🏦 Empréstimos</a>
          <a href="#pagamentos">📄 Pagamentos</a>
          <a href="#extrato">📊 Extrato</a>
        </nav>
        <div className="sidebar-footer">
          <p>Olá, {user.name.split(' ')[0]}</p>
          <button className="btn-logout">Sair</button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="main-content">
        <header className="top-bar">
          <div>
            <h1>Painel Geral</h1>
            <p className="account-info">{user.account}</p>
          </div>
          <div className="user-profile">
            <div className="avatar">P</div>
          </div>
        </header>

        {/* Grid de Cards */}
        <section className="cards-grid">
          {/* Card de Saldo */}
          <div className="card balance-card">
            <div className="card-header">
              <h3>Saldo Disponível</h3>
              <button 
                className="btn-toggle-eye" 
                onClick={() => setShowBalance(!showBalance)}
              >
                {showBalance ? '👁️ Ocultar' : '👁️ Mostrar'}
              </button>
            </div>
            <p className="balance-value">
              {showBalance ? `R$ ${user.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '••••••'}
            </p>
            <span className="badge-status">Conta Corrente</span>
          </div>

          {/* Card de Cartão de Crédito */}
          <div className="card credit-card">
            <h3>Cartão de Crédito</h3>
            <p className="invoice-value">R$ {user.creditCard.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p className="limit-info">Limite disponível: R$ {user.limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(user.creditCard / user.limit) * 100}%` }}></div>
            </div>
          </div>
        </section>

        {/* Histórico de Transações */}
        <section className="transactions-section">
          <h2>Últimas Movimentações</h2>
          <div className="transactions-list">
            {transactions.map((tx) => (
              <div key={tx.id} className="transaction-item">
                <div className="tx-info">
                  <span className={`tx-icon ${tx.positive ? 'icon-in' : 'icon-out'}`}>
                    {tx.positive ? '⇣' : '⇡'}
                  </span>
                  <div>
                    <h4>{tx.type}</h4>
                    <p>{tx.name} • {tx.date}</p>
                  </div>
                </div>
                <span className={`tx-value ${tx.positive ? 'positive' : 'negative'}`}>
                  {tx.positive ? '+' : ''}R$ {tx.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;