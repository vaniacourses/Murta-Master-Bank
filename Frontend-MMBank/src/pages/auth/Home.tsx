import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; 

export const Home: React.FC = () => {
  const navigate = useNavigate();

  // Efeito simples para rolar até o topo ao carregar a página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home-container">
      {/* HEADER */}
      <header className="home-header">
        <div className="logo-area">
          <h2>MM<span>Bank</span></h2>
        </div>
        <nav className="header-nav">
          <a href="#vantagens">Vantagens</a>
          <a href="#servicos">Serviços</a>
          <a href="#sobre">Sobre Nós</a>
        </nav>
        <div className="header-actions">
          <button 
            className="btn-login" 
            onClick={() => navigate('/login')}
          >
            Fazer Login
          </button>
          <button 
            className="btn-register" 
            onClick={() => navigate('/cadastro')}
          >
            Abrir Conta
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content fade-in-up">
          <h1>Seu sucesso financeiro é o nosso <span>compromisso</span>.</h1>
          <p>
            O Murta Master Bank oferece serviços completos e seguros para você e sua empresa. 
            Controle seus gastos, faça transferências via Pix e TED, e solicite crédito com as melhores taxas.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary btn-glow" onClick={() => navigate('/cadastro')}>
              Abra sua conta agora
            </button>
            <a href="#servicos" className="btn-outline" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              Conheça os serviços
            </a>
          </div>
        </div>
        <div className="hero-image fade-in-up delay-1">
          <div className="image-placeholder">
            <div className="floating-shape shape-1"></div>
            <div className="floating-shape shape-2"></div>
            <div className="mock-card glass-card">
              <h3>Saldo Atual</h3>
              <h2>R$ 24.780,50</h2>
              <div className="mock-chart">
                <div className="bar b1"></div>
                <div className="bar b2"></div>
                <div className="bar b3"></div>
                <div className="bar b4"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VANTAGENS SECTION */}
      <section id="vantagens" className="features-section">
        <div className="section-header fade-in-up">
          <h2>Soluções Financeiras Completas</h2>
          <p>Tudo o que você precisa em uma única plataforma digital.</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card fade-in-up delay-1">
            <div className="feature-icon pulse-hover">💸</div>
            <h3>Pix e TED Ilimitados</h3>
            <p>Transfira dinheiro de forma instantânea e segura, 24 horas por dia, 7 dias por semana, sem taxas ocultas.</p>
          </div>
          
          <div className="feature-card fade-in-up delay-2">
            <div className="feature-icon pulse-hover">💳</div>
            <h3>Cartões de Crédito</h3>
            <p>Cartões com limite personalizável, controle de faturas em tempo real e programa de pontos exclusivo.</p>
          </div>
          
          <div className="feature-card fade-in-up delay-3">
            <div className="feature-icon pulse-hover">📊</div>
            <h3>Gestão e Dashboard</h3>
            <p>Acompanhe suas receitas e despesas com gráficos detalhados, categorias inteligentes e relatórios exportáveis.</p>
          </div>

          <div className="feature-card fade-in-up delay-4">
            <div className="feature-icon pulse-hover">🤝</div>
            <h3>Empréstimos</h3>
            <p>Crédito rápido com simulação transparente, cronograma de parcelas e as taxas mais justas do mercado.</p>
          </div>
        </div>
      </section>

      {/* SERVIÇOS SECTION (NOVO) */}
      <section id="servicos" className="services-section">
        <div className="section-header text-light fade-in-up">
          <h2>Nossos Serviços</h2>
          <p>Desenvolvidos para impulsionar o seu crescimento em cada etapa.</p>
        </div>

        <div className="services-wrapper">
          <div className="service-row fade-in-up delay-1">
            <div className="service-text">
              <span className="badge">Para Você</span>
              <h3>Conta Digital Pessoa Física</h3>
              <p>Controle total na palma da sua mão. Faça a gestão do seu dinheiro render mais que a poupança tradicional, com total liquidez e segurança garantida pelo FGC.</p>
              <ul className="service-list">
                <li>✔️ Cartão MMBank Black sem anuidade</li>
                <li>✔️ Rendimento diário automático</li>
                <li>✔️ Saques gratuitos na rede Banco24Horas</li>
              </ul>
            </div>
            <div className="service-visual glass-panel">
              <div className="visual-icon">👤</div>
            </div>
          </div>

          <div className="service-row reverse fade-in-up delay-2">
            <div className="service-text">
              <span className="badge badge-pj">Para sua Empresa</span>
              <h3>Soluções Corporativas (PJ)</h3>
              <p>Simplifique a rotina financeira do seu negócio. Integramos emissão de notas fiscais, pagamento de folha e capital de giro em um único painel ágil.</p>
              <ul className="service-list">
                <li>✔️ Emissão e Gestão de Notas Fiscais Integrada</li>
                <li>✔️ Linhas de crédito exclusivas para expansão</li>
                <li>✔️ Acesso múltiplo com controle de permissões</li>
              </ul>
            </div>
            <div className="service-visual glass-panel pj-panel">
              <div className="visual-icon">🏢</div>
            </div>
          </div>
        </div>
      </section>

      {/* SOBRE NÓS SECTION (NOVO) */}
      <section id="sobre" className="about-section">
        <div className="about-content fade-in-up">
          <div className="about-text">
            <h2>Sobre o <span>MMBank</span></h2>
            <p>
              Nascemos no Instituto de Computação da UFF com um propósito claro: redefinir a relação das pessoas e empresas com o dinheiro. 
              O Murta Master Bank combina engenharia de software de ponta com excelência financeira para entregar um sistema seguro, resiliente e incrivelmente fácil de usar.
            </p>
            <p>
              Acreditamos na transparência absoluta. Sem tarifas surpresas, sem letras miúdas. Apenas tecnologia trabalhando a favor do seu patrimônio.
            </p>
          </div>
          
          <div className="stats-grid">
            <div className="stat-item glass-card-dark">
              <h4>+500k</h4>
              <span>Clientes Ativos</span>
            </div>
            <div className="stat-item glass-card-dark">
              <h4>R$ 2B+</h4>
              <span>Transacionados</span>
            </div>
            <div className="stat-item glass-card-dark">
              <h4>99.9%</h4>
              <span>Disponibilidade (SLA)</span>
            </div>
            <div className="stat-item glass-card-dark">
              <h4>0%</h4>
              <span>Tarifas Ocultas</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION (NOVO) */}
      <section className="cta-section fade-in-up">
        <h2>Pronto para transformar sua vida financeira?</h2>
        <p>Abertura de conta em menos de 5 minutos. Totalmente online e sem burocracia.</p>
        <button className="btn-primary btn-large btn-glow" onClick={() => navigate('/cadastro')}>
          Criar Minha Conta Grátis
        </button>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="logo-area">
            <h2>MM<span>Bank</span></h2>
            <p>O parceiro confiável para sua jornada financeira moderna.</p>
          </div>
          <div className="footer-links">
            <div>
              <h4>Institucional</h4>
              <a href="#vantagens">Vantagens</a>
              <a href="#servicos">Serviços</a>
              <a href="#sobre">Sobre Nós</a>
            </div>
            <div>
              <h4>Suporte e Legal</h4>
              <a href="#faq">Central de Ajuda</a>
              <a href="#termos">Termos de Uso</a>
              <a href="#privacidade">Política de Privacidade (LGPD)</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Murta Master Bank. Todos os direitos reservados. Projeto UFF.</p>
        </div>
      </footer>
    </div>
  );
};