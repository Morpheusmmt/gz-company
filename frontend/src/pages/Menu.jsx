import { LogOut, User, Settings, Home, Scroll, FileText, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { hasPermission } from "../utils/permissionsHelper";
import "./Menu.css";

export default function Menu() {
  const navigate = useNavigate();
  const user = api.auth.getCurrentUser();

  const handleLogout = () => {
    api.auth.logout();
  };

  const menuCards = [
    {
      id: "home",
      icon: Home,
      title: "Início",
      description: "Acesse a página inicial",
      path: "/",
      permission: null 
    },
   {
      id: "profile",
      icon: User,
      title: "Perfil",
      description: "Visualize e edite seu perfil",
      path: "/menu/perfil",
      permission: "profile:edit",
    },
    {
      id: "consultoria",
      icon: Scroll,
      title: "Solicitação de consultoria",
      description: "Solicite a nossa consultoria",
      path: "/menu/form-consultoria",
      permission: "consultations:create"
    },
    {
      id: "consultorias-recebidas",
      icon: FileText,
      title: "Solicitações Recebidas",
      description: "Gerencie as solicitações de consultoria",
      path: "/menu/consultorias",
      permission: "consultations:view" 
    },
    {
      id: "minhas-consultorias",
      icon: FileText,
      title: "Minhas Consultorias",
      description: "Veja suas solicitações de consultoria",
      path: "/menu/minhas-consultorias",
      permission: "consultations:view_own" 
    },
    {
      id: "config-admin",
      icon: Settings,
      title: "Configuração de Usuários",
      description: "Gerencie usuários e permissões",
      path: "/menu/config-admin",
      permission: "users:view_all" 
    },
    {
      id: "projetos",
      icon: FileText,
      title: "Projetos",
      description: "Gerencie seus projetos de P&D",
      path: "/menu/projetos",
      permission: "projects:view_own" 
    }
  ];

  // Filtra cards baseado nas permissões
  const availableCards = menuCards.filter(card => {
    if (!card.permission) return true;
    return hasPermission(user, card.permission);
  });

  return (
    <div className="menu-container">
      <div className="menu-header">
        <h1>Bem-vindo, {user?.nome || "Usuário"}!</h1>
        <p>O que você gostaria de fazer hoje?</p>
      </div>

      <div className="menu-cards">
        {availableCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.id}
              className="menu-card clickable"
              onClick={() => navigate(card.path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate(card.path);
                }
              }}
            >
              <IconComponent size={40} />
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          );
        })}
      </div>

      <div className="user-info">
        <div className="user-details">
          <User size={24} />
          <div>
            <p className="user-name">{user?.nome}</p>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={20} />
          Sair
        </button>
      </div>
    </div>
  );
}