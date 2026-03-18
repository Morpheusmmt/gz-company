import { ArrowLeft, KeyRound, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Perfil.css";

export default function Perfil() {
  const navigate = useNavigate();
  const user = api.auth.getCurrentUser();

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <div className="perfil-header">
          <User size={40} color="#D4A574" />
          <h1>Perfil</h1>
          <p>Informações do seu perfil</p>
        </div>
        <button
          className="back-button"
          onClick={() => navigate("/menu")}
          type="button"
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>
        <div className="perfil-info">
          <p>
            Nome: <span className="user-nome">{user?.nome || "Usuário"}</span>
          </p>
          <p>
            Nome de usuário:
            <span className="user-nome"> @{user?.usuario || "Usuário"}</span>
          </p>
          <p>
            Endereço:
            <span className="user-nome">
              {user?.email || "exemplo@gmail.com"}
            </span>
          </p>
          <p>
            <button
              className="save-button"
              onClick={() => navigate("/menu/perfil/trocar-senha")}
              type="button"
            >
              <KeyRound color="white" size={20} />
              <span>Trocar senha</span>
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}