import { useState } from 'react';
import './contato.css';

export default function Contato() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Mensagem enviada!\n\nNome: ${formData.nome}\nE-mail: ${formData.email}\nAssunto: ${formData.assunto}\nMensagem: ${formData.mensagem}`);
    setFormData({ nome: '', email: '', assunto: '', mensagem: '' });
  };

  return (
    <div className="contact-container">
      <h2>Fale Conosco</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <label htmlFor="nome">Nome:</label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Seu nome"
          required
        />

        <label htmlFor="email">E-mail:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="seu@email.com"
          required
        />

        <label htmlFor="assunto">Assunto:</label>
        <input
          type="text"
          id="assunto"
          name="assunto"
          value={formData.assunto}
          onChange={handleChange}
          placeholder="Assunto da mensagem"
          required
        />

        <label htmlFor="mensagem">Mensagem:</label>
        <textarea
          id="mensagem"
          name="mensagem"
          value={formData.mensagem}
          onChange={handleChange}
          placeholder="Escreva sua mensagem aqui..."
          rows="5"
          required
        />

        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}