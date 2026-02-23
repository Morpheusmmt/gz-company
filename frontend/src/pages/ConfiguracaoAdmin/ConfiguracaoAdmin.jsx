import React, { useState, useMemo, useEffect } from "react";
import { Search, ChevronDown, Check, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./ConfiguracaoAdmin.css";

export default function ConfiguracaoAdmin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingUserId, setSavingUserId] = useState(null);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [originalUserData, setOriginalUserData] = useState({});

  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await api.get("/users");
      setUsers(
        res.data.map((u) => ({
          id: u.id,
          nome: u.nome,
          usuario: u.usuario,
          email: u.email,
          status: typeof u.status === "boolean" ? u.status : true,
          roles: Array.isArray(u.roles) ? u.roles : [],
        }))
      );
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      alert("Erro ao carregar usuários. Verifique o console.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      fetchUsers();
      api
        .get("/users/roles")
        .then((res) => setAvailableRoles(res.data || []))
        .catch((err) => console.error("Erro ao buscar roles:", err));
    }
    return () => {
      mounted = false;
    };
  }, []);

  // Salva o estado original quando expande
  const handleExpandUser = (userId) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
    } else {
      const user = users.find(u => u.id === userId);
      setOriginalUserData({
        [userId]: {
          status: user.status,
          roles: [...user.roles]
        }
      });
      setExpandedUserId(userId);
    }
  };

  // Salva alterações do usuário
  const saveUser = async (userId) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    try {
      setSavingUserId(userId);
      
      await api.put(`/users/${userId}`, { 
        status: user.status,
        roles: user.roles
      });
      
      await fetchUsers();
      setExpandedUserId(null);
      setOriginalUserData({});
      alert("Usuário atualizado com sucesso!");
    } catch (err) {
      console.error("Erro salvando usuário:", err);
      alert("Erro ao salvar alterações. Verifique o console.");
    } finally {
      setSavingUserId(null);
    }
  };

  const cancelEdit = (userId) => {
    if (originalUserData[userId]) {
      setUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, ...originalUserData[userId] }
          : u
      ));
    }
    setExpandedUserId(null);
    setOriginalUserData({});
  };

  // Busca global
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;

    const term = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.nome.toLowerCase().includes(term) ||
        user.usuario.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const toggleUserStatus = async (userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const newStatus = !user.status;
    
    // Atualiza localmente primeiro para feedback imediato
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );

    try {
      // Salva imediatamente no backend
      await api.put(`/users/${userId}`, { 
        status: newStatus,
        roles: user.roles
      });
      alert(newStatus ? "Usuário ativado com sucesso!" : "Usuário desativado com sucesso!");
    } catch (err) {
      console.error("Erro ao alterar status:", err);
      // Reverte em caso de erro
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: !newStatus } : u))
      );
      alert("Erro ao alterar status do usuário.");
    }
  };

  const toggleRole = (userId, roleId) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const hasRole = u.roles.includes(roleId);
          return {
            ...u,
            roles: hasRole
              ? u.roles.filter((r) => r !== roleId)
              : [...u.roles, roleId],
          };
        }
        return u;
      })
    );
  };

  const getRoleName = (roleId) => {
    return availableRoles.find((r) => r.id === roleId)?.nome || "";
  };

  if (loading) {
    return (
      <div className="config-admin-container">
        <div className="config-admin-card">
          <p style={{ textAlign: "center", padding: "40px" }}>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="config-admin-container">
      <div className="config-admin-card">
        <div className="config-header">
          <h1>Configuração de Usuários</h1>
          <p>Gerencie status e permissões dos usuários</p>
        </div>
        <button
          className="back-button"
          onClick={() => navigate("/menu")}
          type="button"
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>

        <div className="config-controls">
          <div className="search-box">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por nome, usuário ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => setSearchTerm("")}
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="pagination-selector">
            <span className="per-page-label">Exibir:</span>
            <div className="dropdown-container">
              <button
                className="dropdown-button"
                onClick={() => setShowPerPageDropdown(!showPerPageDropdown)}
              >
                {itemsPerPage}
                <ChevronDown size={18} />
              </button>
              {showPerPageDropdown && (
                <div className="dropdown-menu">
                  {[10, 30, 50, 100].map((num) => (
                    <button
                      key={num}
                      className={`dropdown-item ${
                        itemsPerPage === num ? "active" : ""
                      }`}
                      onClick={() => {
                        setItemsPerPage(num);
                        setShowPerPageDropdown(false);
                      }}
                    >
                      {num}
                      {itemsPerPage === num && <Check size={16} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="results-info">
          {searchTerm ? (
            <p>
              Encontrados <strong>{filteredUsers.length}</strong> usuário(s) de{" "}
              <strong>{users.length}</strong> no total
            </p>
          ) : (
            <p>
              Exibindo <strong>{paginatedUsers.length}</strong> de{" "}
              <strong>{users.length}</strong> usuários
            </p>
          )}
        </div>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Usuário</th>
                <th>Email</th>
                <th>Status</th>
                <th>Permissões</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-results">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <React.Fragment key={user.id}>
                    <tr>
                      <td>{user.id.substring(0, 8)}...</td>
                      <td className="user-name">{user.nome}</td>
                      <td>{user.usuario}</td>
                      <td>{user.email}</td>
                      <td>
                        <button
                          className={`status-toggle ${
                            user.status ? "active" : "inactive"
                          }`}
                          onClick={() => toggleUserStatus(user.id)}
                        >
                          {user.status ? "Ativo" : "Inativo"}
                        </button>
                      </td>
                      <td>
                        <button
                          className="permissions-button"
                          onClick={() => handleExpandUser(user.id)}
                        >
                          {user.roles.length > 0
                            ? user.roles.map((r) => getRoleName(r)).join(", ")
                            : "Sem permissões"}
                          <ChevronDown
                            size={16}
                            className={
                              expandedUserId === user.id ? "rotated" : ""
                            }
                          />
                        </button>
                      </td>
                    </tr>
                    {expandedUserId === user.id && (
                      <tr className="permissions-row">
                        <td colSpan="6">
                          <div className="permissions-container">
                            <h4>Atribuir Permissões</h4>
                            <div className="roles-grid">
                              {availableRoles.map((role) => (
                                <button
                                  key={role.id}
                                  className={`role-chip ${
                                    user.roles.includes(role.id)
                                      ? "selected"
                                      : ""
                                  }`}
                                  onClick={() => toggleRole(user.id, role.id)}
                                >
                                  {role.nome}
                                  {user.roles.includes(role.id) && (
                                    <Check size={16} />
                                  )}
                                </button>
                              ))}
                            </div>
                            <div className="permissions-actions">
                              <button
                                className="save-button"
                                onClick={() => saveUser(user.id)}
                                disabled={savingUserId === user.id}
                              >
                                {savingUserId === user.id
                                  ? "Salvando..."
                                  : "Salvar Alterações"}
                              </button>
                              <button
                                className="cancel-button"
                                onClick={() => cancelEdit(user.id)}
                                disabled={savingUserId === user.id}
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </button>

            <div className="pagination-numbers">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    className={`pagination-number ${
                      currentPage === pageNum ? "active" : ""
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              className="pagination-button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  );
}