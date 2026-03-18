import Navbar from "./Navbar.jsx";
import Contato from "./contato.jsx"; 
import Footer from "./Footer.jsx";
import PopularServicesCarousel from "./PopularServicesCarousel";
import { Sparkles, Shield, Leaf, Microscope, Zap, Award, ChevronRight, BookOpen, Lightbulb, TrendingUp } from "lucide-react";
import "./Home.css";
import { useNavigate } from "react-router-dom";


function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      <Navbar />
      
      <main className="hero-section" id="Início">
        <div className="hero-text">
          <div className="badge-innovation">
            <Sparkles size={16} />
            <span>Inovação em Tecnologia</span>
          </div>
          <h1>GZ Company - Soluções Inovadoras em Tecnologia</h1>
          <h2>Do conceito ao produto: soluções tecnológicas sob medida.</h2>
          <p className="hero-description">
            A GZ Company é uma empresa especializada no desenvolvimento de soluções tecnológicas 
            inovadoras. Unimos conhecimento técnico, criatividade e visão estratégica 
            para entregar soluções que agregam valor real para empresas, indústrias e startups.
          </p>
          <div className="hero-ctas">
            <button className="btn-primary" onClick={() => navigate("/login")}>
              Solicitar Orçamento
              <ChevronRight size={20} />
            </button>

            <button className="btn-secondary" onClick={() => document.getElementById("servicos")?.scrollIntoView({ behavior: "smooth" })}>
              Conheça Nossas Soluções
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="image-decoration"></div>
          <img
            src="/logo.png"
            alt="GZ Company - Soluções em Tecnologia"
            className="hero-logo-img"
          />
        </div>
      </main>

      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-icon">
              <Microscope size={32} />
            </div>
            <h3>Desenvolvimento de Software</h3>
            <p>Metodologias ágeis e foco em resultados</p>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              <Lightbulb size={32} />
            </div>
            <h3>Soluções em Nuvem</h3>
            <p>Arquiteturas escaláveis e modernas</p>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              <BookOpen size={32} />
            </div>
            <h3>Consultoria Especializada</h3>
            <p>Suporte técnico completo em TI</p>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              <Leaf size={32} />
            </div>
            <h3>Inovação</h3>
            <p>Tecnologias de ponta e práticas DevOps</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-content">
          <h2>Quem Somos</h2>
          <p>
            A GZ Company é uma empresa dedicada ao desenvolvimento de soluções tecnológicas inovadoras. 
            Atuamos na criação de software sob demanda, consultorias especializadas em TI e projetos de transformação digital. 
            Nosso propósito é transformar desafios em oportunidades, oferecendo tecnologias capazes de elevar a performance, 
            a eficiência e a competitividade dos negócios.
          </p>
          <p>
            Unimos conhecimento técnico, criatividade e visão estratégica para entregar soluções que agregam valor real 
            para empresas, startups e instituições.
          </p>
        </div>
      </section>

      <section className="mission-vision-section">
        <div className="mission-vision-grid">
          <div className="mission-card">
            <h3>📌 Nossa Missão</h3>
            <p>
              Agregar valor e inovação aos negócios de nossos clientes, por meio do desenvolvimento 
              de soluções tecnológicas que impulsionem a competitividade, a eficiência e a transformação digital.
            </p>
          </div>
          
          <div className="vision-card">
            <h3>📌 Nossa Visão</h3>
            <p>
              Ser referência em soluções tecnológicas inovadoras, promovendo um futuro 
              mais conectado e eficiente para empresas no Brasil e no mundo — impulsionando sua competitividade por meio 
              da inovação, da qualidade e da excelência técnica.
            </p>
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="values-content">
          <h2>📌 Nossos Valores</h2>
          <div className="values-grid">
            <div className="value-card">
              <h4>🤝 Ética</h4>
              <p>Integridade e responsabilidade em todas as decisões, parcerias e entregas.</p>
            </div>
            <div className="value-card">
              <h4>💚 Respeito</h4>
              <p>Valorização de pessoas, ideias, culturas e do meio ambiente.</p>
            </div>
            <div className="value-card">
              <h4>✅ Comprometimento</h4>
              <p>Projetos conduzidos com seriedade, excelência e foco em resultados.</p>
            </div>
            <div className="value-card">
              <h4>🎨 Criatividade</h4>
              <p>Estímulo à experimentação e à busca por soluções originais.</p>
            </div>
            <div className="value-card">
              <h4>🌍 Inclusão</h4>
              <p>Ambiente diverso, plural e colaborativo que acolhe e impulsiona talentos.</p>
            </div>
            <div className="value-card">
              <h4>⚡ Inovação</h4>
              <p>Investimento contínuo em conhecimento e tecnologia de ponta.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="services-section" id="servicos">
        <div className="services-header">
          <h2>O que Fazemos - Nossos Pilares</h2>
          <p>Soluções completas em tecnologia para sua empresa</p>
        </div>
        <PopularServicesCarousel />
      </section>

      <section className="capabilities-section">
        <div className="capabilities-content">
          <h2>Nossas Competências Tecnológicas</h2>
          <div className="capabilities-grid">
            <div className="capability-item">
              <Microscope className="capability-icon" size={32} />
              <h4>Desenvolvimento Full Stack</h4>
            </div>
            <div className="capability-item">
              <Zap className="capability-icon" size={32} />
              <h4>Arquitetura Cloud Native</h4>
            </div>
            <div className="capability-item">
              <TrendingUp className="capability-icon" size={32} />
              <h4>DevOps e CI/CD</h4>
            </div>
            <div className="capability-item">
              <Shield className="capability-icon" size={32} />
              <h4>Segurança de Aplicações</h4>
            </div>
            <div className="capability-item">
              <Leaf className="capability-icon" size={32} />
              <h4>APIs e Integrações</h4>
            </div>
            <div className="capability-item">
              <Award className="capability-icon" size={32} />
              <h4>Soluções de Alta Performance</h4>
            </div>
          </div>
        </div>
      </section>

      <section className="applications-section">
        <div className="applications-content">
          <h2>📌 Áreas de Atuação</h2>
          <div className="applications-grid">
            <div className="application-card">
              <div className="application-number">01</div>
              <h3>E-commerce</h3>
            </div>
            <div className="application-card">
              <div className="application-number">02</div>
              <h3>Fintech</h3>
            </div>
            <div className="application-card">
              <div className="application-number">03</div>
              <h3>Healthtech</h3>
            </div>
            <div className="application-card">
              <div className="application-number">04</div>
              <h3>Logística</h3>
            </div>
            <div className="application-card">
              <div className="application-number">05</div>
              <h3>Educação</h3>
            </div>
            <div className="application-card">
              <div className="application-number">06</div>
              <h3>Indústria 4.0</h3>
            </div>
            <div className="application-card">
              <div className="application-number">07</div>
              <h3>Startups</h3>
            </div>
            <div className="application-card">
              <div className="application-number">08</div>
              <h3>Governo Digital</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="diferentials-section">
        <div className="diferentials-content">
          <h2>📌 Nossos Diferenciais</h2>
          <div className="diferentials-grid">
            <div className="diferential-card">
              <h3>Forte Base Científica</h3>
              <p>Aliada à aplicação prática e resultados reais</p>
            </div>
            <div className="diferential-card">
              <h3>Desenvolvimento Personalizado</h3>
              <p>Soluções conforme a necessidade específica do cliente</p>
            </div>
            <div className="diferential-card">
              <h3>Expertise Avançada</h3>
              <p>Conhecimento profundo em materiais avançados</p>
            </div>
            <div className="diferential-card">
              <h3>Atuação Responsável</h3>
              <p>Ética e foco em impacto positivo</p>
            </div>
            <div className="diferential-card">
              <h3>Parcerias Estratégicas</h3>
              <p>Colaboração com universidades e centros de pesquisa</p>
            </div>
            <div className="diferential-card">
              <h3>Metodologia Rigorosa</h3>
              <p>Processos estruturados com foco em qualidade</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Transforme Seu Projeto com Tecnologia</h2>
          <p>Descubra como as soluções inovadoras da GZ Company podem elevar a performance e eficiência de sua empresa</p>
          <button className="btn-primary" onClick={() => navigate("/login")}>
            Solicitar Orçamento
            <ChevronRight size={20} />
          </button>
        </div>
      </section>

      <section id="Fale conosco" className="contact-section">
        <Contato />
      </section>

      <Footer />
    </div>
  );
}

export default Home;