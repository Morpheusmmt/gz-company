import { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../Login.css';
import './RecuperarSenha.css';

export default function RecuperarSenha() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🚀 Iniciando requisição...', { email });

    try {
      console.log('📤 Enviando request para:', 'http://localhost:3000/api/forgot-password');
      
      const response = await fetch('http://localhost:3000/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log('📥 Response recebida:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });

      const data = await response.json();
      console.log('📦 Data recebida:', data);

      if (!response.ok) {
        console.error('❌ Erro na resposta:', data.error);
        throw new Error(data.error || 'Algo deu errado');
      }

      console.log('✅ Sucesso! Navegando para verificar-codigo...');
      console.log('📧 Email sendo passado:', email);
      
      navigate('/verificar-codigo', { state: { email } });
      console.log('🎯 Navigate chamado!');
      
    } catch (err) {
      console.error('💥 ERRO CAPTURADO:', err);
      console.error('Stack trace:', err.stack);
      setError(err.message || 'Erro ao enviar código. Tente novamente.');
    } finally {
      console.log('🏁 Finally executado, setLoading(false)');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <button
          className="back-button"
          onClick={() => navigate('/login')}
          type="button"
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>

        <div className="login-header">
          <h1>Recuperar Senha</h1>
          <p>Digite seu e-mail para receber o código de recuperação</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Código'}
          </button>
        </form>

        <p className="register-link">
          Lembrou sua senha?{' '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/login');
            }}
          >
            Fazer login
          </a>
        </p>
      </div>
    </div>
  );
}