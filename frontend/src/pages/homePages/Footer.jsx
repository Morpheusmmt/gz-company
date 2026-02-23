import { Instagram, Facebook, Mail, Phone } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-section">
        <p className="footer-title">Contato</p>
        <div className="footer-contact">
          <div className="footer-contact-item">
            <Mail size={18} />
            <span>contato@gzcompany.com</span>
          </div>
          <div className="footer-contact-item">
            <Phone size={18} />
            <span>(85) 99999-9999</span>
          </div>
        </div>
      </div>

      <div className="footer-section">
        <p className="footer-title">Institucional</p>
        <a href="/sobre" className="footer-link">Sobre Nós</a>
        <a href="/politicas" className="footer-link">Políticas da Empresa</a>
        <a href="/termos" className="footer-link">Termos & Condições</a>
      </div>

      <div className="footer-section">
        <p className="footer-title">Siga-nos</p>
        <div className="footer-icons">
          <a 
            href="https://www.instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-social-link"
            aria-label="Instagram"
          >
            <Instagram size={28} />
          </a>
          <a 
            href="https://www.facebook.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-social-link"
            aria-label="Facebook"
          >
            <Facebook size={28} />
          </a>
        </div>
      </div>

      <div className="footer-section footer-copyright">
        <p>© 2025 GZ Company. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}