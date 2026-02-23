import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CodigoVerificacao.css";


const CodigoVerificacao = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState("");

  const validarCodigo = (e) => {
    e.preventDefault();

    if (!email) {
      setErro("Email ausente. Volte e solicite o código novamente.");
      return;
    }

    if (codigo.trim() === "") {
      setErro("Por favor, insira o código de verificação.");
    } else if (codigo.length !== 6) {
      setErro("O código deve conter 6 dígitos.");
    } else {
      setErro("");
      // Navegar para a tela de redefinir e passar email e código
      navigate("/redefinir-senha", { state: { email, codigo } });
    }
  };

  return (
    <div className="codigo-container">
      <div className="codigo-card">
        <h2>Verificação de Código</h2>
        <p>Insira o código enviado para seu e-mail.</p>

        <form onSubmit={validarCodigo}>
          <input
            type="text"
            placeholder="Digite o código"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            className="codigo-input"
            maxLength={6}
          />

          {erro && <p className="erro">{erro}</p>}

          <button type="submit" className="botao-confirmar">
            Validar Código
          </button>
        </form>
      </div>
    </div>
  );
};

export default CodigoVerificacao;
