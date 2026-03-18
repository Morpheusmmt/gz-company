import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import ProtectedRoute from "./components/ProtectedRoute";
import Menu from "./pages/Menu";
import api from "./services/api";
import RecuperarSenha from "./pages/RedefinirSenha/RecuperarSenha";
import "./App.css";
import CodigoVerificacao from "./pages/RedefinirSenha/CodigoVerificacao";
import RedefinirSenha from "./pages/RedefinirSenha/RedefinirSenha";
import ConfiguracaoAdmin from "./pages/ConfiguracaoAdmin/ConfiguracaoAdmin";
import FormConsultoria from "./pages/FormConsultoria/FormConsultoria";
import ConsultoriasList from "./pages/Consultorias/ConsultoriasList";
import Home from "./pages/homePages/Home";
import ProjectsScreen from "./pages/Projetos/ProjectsScreen"
import TrocarSenha from "./pages/TrocarSenha/TrocarSenha"
import Perfil from "./pages/Perfil/Perfil"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        <Route
          path="/login"
          element={
            api.auth.isAuthenticated() ? (
              <Navigate to="/menu" replace />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/registro"
          element={
            api.auth.isAuthenticated() ? (
              <Navigate to="/menu" replace />
            ) : (
              <Registro />
            )
          }
        />

        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/verificar-codigo" element={<CodigoVerificacao />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />
        <Route
          path="/menu/perfil/trocar-senha"
          element={
            <ProtectedRoute>
              <TrocarSenha />
            </ProtectedRoute>
          }
        />

        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          }
        />

        <Route
          path="/menu/form-consultoria"
          element={
            <ProtectedRoute requiredPermission="consultations:create">
              <FormConsultoria />
            </ProtectedRoute>
          }
        />

        <Route
          path="/menu/consultorias"
          element={
            <ProtectedRoute requiredPermission="consultations:view">
              <ConsultoriasList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/menu/minhas-consultorias"
          element={
            <ProtectedRoute requiredPermission="consultations:view_own">
              <ConsultoriasList userOnly={true} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/menu/config-admin"
          element={
            <ProtectedRoute requiredPermission="users:view_all">
              <ConfiguracaoAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/menu/perfil"
          element={
            <ProtectedRoute requiredPermission="profile:edit">
              <Perfil />
            </ProtectedRoute>
          }
        />

        <Route 
        path="/menu/projetos"
        element={
          <ProtectedRoute requiredPermission={"projects:view_own"}>
            <ProjectsScreen/>
          </ProtectedRoute>
        }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;