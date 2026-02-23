import { useState } from "react";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./TrocarSenha.css";

export default function TrocarSenha() {
  const navigate = useNavigate();
  // const location = useLocation();
  // const email = location.state?.email || "";
  // const codigo = location.state?.codigo || "";
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!senhaAtual || !novaSenha) {
      setErro("Parâmetros obrigatórios: senhaAtual e novaSenha.");
      return;
    }

    if (senhaAtual === novaSenha) {
      setErro("A nova senha deve ser diferente da senha atual.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.put("/api/reset-password-logged", {
        senhaAtual,
        novaSenha,
      });

      setSucesso(response.data?.message || "Senha redefinida com sucesso!");
      setTimeout(() => {
        navigate("/menu/perfil");
      }, 1500);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Erro ao redefinir senha.";
      setErro(errorMessage);
      console.error("Erro reset senha:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rs-container">
      <div className="rs-card">
        <button
          className="back-button"
          onClick={() => navigate("/menu/perfil")}
          type="button"
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>

        <div className="rs-header">
          <h2>Trocar Senha</h2>
          <p></p>
        </div>

        {erro && <p className="erro">{erro}</p>}
        {sucesso && <p className="success-message">{sucesso}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="senhaAtual">Senha Atual</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type={showCurrentPassword ? "text" : "password"}
                id="senhaAtual"
                name="senhaAtual"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                placeholder="••••••••"
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="novaSenha">Nova Senha</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type={showNewPassword ? "text" : "password"}
                id="novaSenha"
                name="novaSenha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="••••••••"
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
