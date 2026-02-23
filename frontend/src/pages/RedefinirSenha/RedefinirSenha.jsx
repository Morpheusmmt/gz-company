import { useState } from "react";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";
import "../Login.css";
import "./RedefinirSenha.css";

export default function RedefinirSenha() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const codigo = location.state?.codigo || "";
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não conferem!");
      return;
    }

    if (!email || !codigo) {
      setErro("Dados de recuperação ausentes. Inicie o processo novamente.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/reset-password', {
        email,
        codigoRecuperacao: codigo,
        novaSenha,
      });

      setSucesso(response.data?.message || 'Senha redefinida com sucesso!');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Erro ao redefinir senha.';
      setErro(errorMessage);
      console.error('Erro reset senha:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rs-container">
      <div className="rs-card">
        <button
          className="back-button"
          onClick={() => navigate("/login")}
          type="button"
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>

        <div className="rs-header">
          <h2>Redefina sua senha</h2>
          <p>Elabore sua nova senha</p>
        </div>

        {erro && <p className="erro">{erro}</p>}
        {sucesso && <p className="success-message">{sucesso}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="novaSenha">Nova Senha</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                id="novaSenha"
                name="novaSenha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="••••••••"
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmarSenha">Confirmar Senha</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmarSenha"
                name="confirmarSenha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="••••••••"
                required
              />
              <span
                className="toggle-password"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Enviando..." : "Alterar Senha"}
          </button>
        </form>
      </div>
    </div>
  );
}
