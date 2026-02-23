import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Download,
  FileText,
  Calendar,
  User,
  FolderOpen,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  X,
  Eye,
  BarChart3,
  Briefcase,
  AlertCircle,
  File
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { hasPermission, isAdmin as checkIsAdmin } from "../../utils/permissionsHelper";
import "./ProjectsScreen.css";

export default function ProjectsScreen() {
  const navigate = useNavigate();
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [etapaFilter, setEtapaFilter] = useState("");
  const [aprovadoFilter, setAprovadoFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showEtapaDropdown, setShowEtapaDropdown] = useState(false);
  const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [estatisticas, setEstatisticas] = useState(null);

  // Modais
  const [showNovoProjetoModal, setShowNovoProjetoModal] = useState(false);
  const [showEditarProjetoModal, setShowEditarProjetoModal] = useState(false);
  const [showDetalhesModal, setShowDetalhesModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [selectedProjeto, setSelectedProjeto] = useState(null);

  const currentUser = api.auth.getCurrentUser();
  const isAdminUser = checkIsAdmin(currentUser);

  // Fetch projetos
  const fetchProjetos = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        ...(statusFilter && { status: statusFilter }),
        ...(etapaFilter && { etapa: etapaFilter }),
        ...(aprovadoFilter && { aprovado: aprovadoFilter }),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await api.get(`/api/projetos?${params}`);
      setProjetos(response.data.data || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);
      setErrorMessage("Erro ao carregar projetos");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, statusFilter, etapaFilter, aprovadoFilter, searchTerm]);

  // Fetch estatísticas
  const fetchEstatisticas = useCallback(async () => {
    try {
      const response = await api.get("/api/projetos/estatisticas");
      setEstatisticas(response.data.data);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  }, []);

  useEffect(() => {
    fetchProjetos();
    fetchEstatisticas();
  }, [fetchProjetos, fetchEstatisticas]);

  // Handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProjetos();
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 3000);
  };

  // Aprovar/Reprovar projeto
  const handleAprovar = async (projetoId, aprovar) => {
    try {
      await api.patch(`/api/projetos/${projetoId}/aprovar`, { aprovado: aprovar });
      showSuccess(aprovar ? "Projeto aprovado com sucesso!" : "Projeto reprovado");
      fetchProjetos();
      fetchEstatisticas();
    } catch (error) {
      showError(error.response?.data?.message || "Erro ao atualizar aprovação");
    }
  };

  // Excluir projeto
  const handleExcluir = async () => {
    if (!selectedProjeto) return;
    try {
      await api.delete(`/api/projetos/${selectedProjeto.id}`);
      showSuccess("Projeto excluído com sucesso!");
      setShowConfirmDeleteModal(false);
      setSelectedProjeto(null);
      fetchProjetos();
      fetchEstatisticas();
    } catch (error) {
      showError(error.response?.data?.message || "Erro ao excluir projeto");
    }
  };

  // Format helpers
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const getStatusLabel = (status) => {
    const labels = {
      em_andamento: "Em Andamento",
      concluido: "Concluído",
      pausado: "Pausado",
      cancelado: "Cancelado",
    };
    return labels[status] || status;
  };

  const getEtapaLabel = (etapa) => {
    const labels = {
      planejamento: "Planejamento",
      desenvolvimento: "Desenvolvimento",
      testes: "Testes",
      revisao: "Revisão",
      finalizado: "Finalizado",
    };
    return labels[etapa] || etapa;
  };

  const canEditProject = (projeto) => {
    if (isAdminUser) return true;
    return projeto.criadorId === currentUser?.id || projeto.responsavelId === currentUser?.id;
  };

  const canDeleteProject = (projeto) => {
    if (isAdminUser) return true;
    return projeto.criadorId === currentUser?.id;
  };

  return (
    <div className="projetos-container">
      <div className="projetos-card">
        {/* Header */}
        <button className="back-button" onClick={() => navigate("/menu")}>
          <ArrowLeft size={20} />
          Voltar ao Menu
        </button>

        <div className="projetos-header">
          <div className="projetos-header-info">
            <h1>Gestão de Projetos</h1>
            <p>Gerencie seus projetos</p>
          </div>
          <div className="projetos-header-actions">
            <button className="btn-novo-projeto" onClick={() => setShowNovoProjetoModal(true)}>
              <Plus size={20} />
              Novo Projeto
            </button>
          </div>
        </div>

        {/* Mensagens */}
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {/* Estatísticas */}
        {estatisticas && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon total">
                <Briefcase size={24} />
              </div>
              <div className="stat-info">
                <h3>{estatisticas.total}</h3>
                <p>Total de Projetos</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon andamento">
                <Clock size={24} />
              </div>
              <div className="stat-info">
                <h3>{estatisticas.emAndamento}</h3>
                <p>Em Andamento</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon concluido">
                <CheckCircle size={24} />
              </div>
              <div className="stat-info">
                <h3>{estatisticas.concluidos}</h3>
                <p>Concluídos</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon aprovado">
                <BarChart3 size={24} />
              </div>
              <div className="stat-info">
                <h3>{estatisticas.aprovados}</h3>
                <p>Aprovados</p>
              </div>
            </div>
            {isAdminUser && (
              <div className="stat-card">
                <div className="stat-icon pendente">
                  <AlertCircle size={24} />
                </div>
                <div className="stat-info">
                  <h3>{estatisticas.pendentesAprovacao}</h3>
                  <p>Pendentes</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filtros */}
        <div className="projetos-controls">
          <form className="search-box" onSubmit={handleSearchSubmit}>
            <Search size={20} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por título, descrição ou responsável..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </form>

          <div className="filters-group">
            {/* Filtro Status */}
            <div className="dropdown-container">
              <button
                type="button"
                className="dropdown-button"
                onClick={() => {
                  setShowStatusDropdown(!showStatusDropdown);
                  setShowEtapaDropdown(false);
                  setShowPerPageDropdown(false);
                }}
              >
                Status: {statusFilter ? getStatusLabel(statusFilter) : "Todos"}
                <ChevronDown size={16} />
              </button>
              {showStatusDropdown && (
                <div className="dropdown-menu">
                  <button
                    className={`dropdown-item ${!statusFilter ? "active" : ""}`}
                    onClick={() => {
                      setStatusFilter("");
                      setShowStatusDropdown(false);
                      setCurrentPage(1);
                    }}
                  >
                    Todos
                  </button>
                  {["em_andamento", "concluido", "pausado", "cancelado"].map((s) => (
                    <button
                      key={s}
                      className={`dropdown-item ${statusFilter === s ? "active" : ""}`}
                      onClick={() => {
                        setStatusFilter(s);
                        setShowStatusDropdown(false);
                        setCurrentPage(1);
                      }}
                    >
                      {getStatusLabel(s)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filtro Etapa */}
            <div className="dropdown-container">
              <button
                type="button"
                className="dropdown-button"
                onClick={() => {
                  setShowEtapaDropdown(!showEtapaDropdown);
                  setShowStatusDropdown(false);
                  setShowPerPageDropdown(false);
                }}
              >
                Etapa: {etapaFilter ? getEtapaLabel(etapaFilter) : "Todas"}
                <ChevronDown size={16} />
              </button>
              {showEtapaDropdown && (
                <div className="dropdown-menu">
                  <button
                    className={`dropdown-item ${!etapaFilter ? "active" : ""}`}
                    onClick={() => {
                      setEtapaFilter("");
                      setShowEtapaDropdown(false);
                      setCurrentPage(1);
                    }}
                  >
                    Todas
                  </button>
                  {["planejamento", "desenvolvimento", "testes", "revisao", "finalizado"].map((e) => (
                    <button
                      key={e}
                      className={`dropdown-item ${etapaFilter === e ? "active" : ""}`}
                      onClick={() => {
                        setEtapaFilter(e);
                        setShowEtapaDropdown(false);
                        setCurrentPage(1);
                      }}
                    >
                      {getEtapaLabel(e)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filtro Aprovação (apenas admin) */}
            {isAdminUser && (
              <div className="dropdown-container">
                <button
                  type="button"
                  className="dropdown-button"
                  onClick={() => {
                    setShowPerPageDropdown(!showPerPageDropdown);
                    setShowStatusDropdown(false);
                    setShowEtapaDropdown(false);
                  }}
                >
                  Aprovação: {aprovadoFilter === "true" ? "Aprovados" : aprovadoFilter === "false" ? "Pendentes" : "Todos"}
                  <ChevronDown size={16} />
                </button>
                {showPerPageDropdown && (
                  <div className="dropdown-menu">
                    <button
                      className={`dropdown-item ${!aprovadoFilter ? "active" : ""}`}
                      onClick={() => {
                        setAprovadoFilter("");
                        setShowPerPageDropdown(false);
                        setCurrentPage(1);
                      }}
                    >
                      Todos
                    </button>
                    <button
                      className={`dropdown-item ${aprovadoFilter === "true" ? "active" : ""}`}
                      onClick={() => {
                        setAprovadoFilter("true");
                        setShowPerPageDropdown(false);
                        setCurrentPage(1);
                      }}
                    >
                      Aprovados
                    </button>
                    <button
                      className={`dropdown-item ${aprovadoFilter === "false" ? "active" : ""}`}
                      onClick={() => {
                        setAprovadoFilter("false");
                        setShowPerPageDropdown(false);
                        setCurrentPage(1);
                      }}
                    >
                      Pendentes
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Lista de Projetos */}
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            Carregando projetos...
          </div>
        ) : projetos.length === 0 ? (
          <div className="empty-state">
            <FolderOpen size={64} className="empty-icon" />
            <h3>Nenhum projeto encontrado</h3>
            <p>Comece criando um novo projeto</p>
            <button className="btn-primary" onClick={() => setShowNovoProjetoModal(true)}>
              <Plus size={20} />
              Criar Projeto
            </button>
          </div>
        ) : (
          <>
            <div className="projetos-grid">
              {projetos.map((projeto) => (
                <div key={projeto.id} className="projeto-card">
                  <div className="projeto-card-header">
                    <div className="projeto-card-title">
                      <h3>{projeto.titulo}</h3>
                      <div className="projeto-date">
                        <Calendar size={14} />
                        {formatDate(projeto.criadoEm)}
                      </div>
                    </div>
                    <div className="projeto-badges">
                      <span className={`status-badge ${projeto.status}`}>
                        {getStatusLabel(projeto.status)}
                      </span>
                      <span className={`aprovacao-badge ${projeto.aprovado ? "aprovado" : "pendente"}`}>
                        {projeto.aprovado ? (
                          <>
                            <CheckCircle size={12} /> Aprovado
                          </>
                        ) : (
                          <>
                            <Clock size={12} /> Pendente
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="projeto-card-body">
                    <p className="projeto-descricao">{projeto.descricao}</p>

                    <div className="projeto-info-grid">
                      <div className="info-item">
                        <span className="info-label">Responsável</span>
                        <span className="info-value">
                          <User size={14} style={{ marginRight: 4 }} />
                          {projeto.responsavel?.nome || projeto.criador?.nome || "-"}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Etapa</span>
                        <span className={`etapa-badge ${projeto.etapa}`}>
                          {getEtapaLabel(projeto.etapa)}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Prazo</span>
                        <span className="info-value">
                          {projeto.dataFim ? formatDate(projeto.dataFim) : "Não definido"}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Arquivos</span>
                        <span className="arquivos-count">
                          <FileText size={14} />
                          {projeto.arquivos?.length || 0} arquivo(s)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="projeto-card-actions">
                    <button
                      className="btn-action"
                      onClick={() => {
                        setSelectedProjeto(projeto);
                        setShowDetalhesModal(true);
                      }}
                    >
                      <Eye size={16} />
                      Ver
                    </button>

                    {canEditProject(projeto) && (
                      <>
                        <button
                          className="btn-action"
                          onClick={() => {
                            setSelectedProjeto(projeto);
                            setShowEditarProjetoModal(true);
                          }}
                        >
                          <Edit2 size={16} />
                          Editar
                        </button>
                        <button
                          className="btn-action primary"
                          onClick={() => {
                            setSelectedProjeto(projeto);
                            setShowUploadModal(true);
                          }}
                        >
                          <Upload size={16} />
                          Upload
                        </button>
                      </>
                    )}

                    {isAdminUser && !projeto.aprovado && (
                      <button
                        className="btn-action success"
                        onClick={() => handleAprovar(projeto.id, true)}
                      >
                        <CheckCircle size={16} />
                        Aprovar
                      </button>
                    )}

                    {isAdminUser && projeto.aprovado && (
                      <button
                        className="btn-action warning"
                        onClick={() => handleAprovar(projeto.id, false)}
                      >
                        <XCircle size={16} />
                        Reprovar
                      </button>
                    )}

                    {canDeleteProject(projeto) && (
                      <button
                        className="btn-action danger"
                        onClick={() => {
                          setSelectedProjeto(projeto);
                          setShowConfirmDeleteModal(true);
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-button"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
                <span className="pagination-info">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  className="pagination-button"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Novo Projeto */}
      {showNovoProjetoModal && (
        <NovoProjetoModal
          onClose={() => setShowNovoProjetoModal(false)}
          onSuccess={() => {
            setShowNovoProjetoModal(false);
            showSuccess("Projeto criado com sucesso!");
            fetchProjetos();
            fetchEstatisticas();
          }}
          onError={showError}
        />
      )}

      {/* Modal Editar Projeto */}
      {showEditarProjetoModal && selectedProjeto && (
        <EditarProjetoModal
          projeto={selectedProjeto}
          onClose={() => {
            setShowEditarProjetoModal(false);
            setSelectedProjeto(null);
          }}
          onSuccess={() => {
            setShowEditarProjetoModal(false);
            setSelectedProjeto(null);
            showSuccess("Projeto atualizado com sucesso!");
            fetchProjetos();
          }}
          onError={showError}
        />
      )}

      {/* Modal Detalhes */}
      {showDetalhesModal && selectedProjeto && (
        <DetalhesProjetoModal
          projeto={selectedProjeto}
          isAdmin={isAdminUser}
          currentUserId={currentUser?.id}
          onClose={() => {
            setShowDetalhesModal(false);
            setSelectedProjeto(null);
          }}
          onUpload={() => {
            setShowDetalhesModal(false);
            setShowUploadModal(true);
          }}
          onRefresh={fetchProjetos}
          showSuccess={showSuccess}
          showError={showError}
        />
      )}

      {/* Modal Upload */}
      {showUploadModal && selectedProjeto && (
        <UploadArquivoModal
          projeto={selectedProjeto}
          onClose={() => {
            setShowUploadModal(false);
            setSelectedProjeto(null);
          }}
          onSuccess={() => {
            setShowUploadModal(false);
            showSuccess("Arquivo enviado com sucesso!");
            fetchProjetos();
          }}
          onError={showError}
        />
      )}

      {/* Modal Confirmação Delete */}
      {showConfirmDeleteModal && selectedProjeto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Confirmar Exclusão</h2>
              <button className="modal-close" onClick={() => setShowConfirmDeleteModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <p>
                Tem certeza que deseja excluir o projeto <strong>{selectedProjeto.titulo}</strong>?
              </p>
              <p style={{ color: "#dc3545", marginTop: 12 }}>
                Esta ação não pode ser desfeita. Todos os arquivos serão excluídos permanentemente.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowConfirmDeleteModal(false)}>
                Cancelar
              </button>
              <button className="btn-action danger" onClick={handleExcluir}>
                <Trash2 size={16} />
                Excluir Projeto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente Modal Novo Projeto
function NovoProjetoModal({ onClose, onSuccess, onError }) {
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    dataInicio: "",
    dataFim: "",
    etapa: "planejamento",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titulo || !formData.descricao) {
      onError("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/projetos", formData);
      onSuccess();
    } catch (error) {
      onError(error.response?.data?.message || "Erro ao criar projeto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Novo Projeto</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Título do Projeto *</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Digite o título do projeto"
              />
            </div>

            <div className="form-group">
              <label>Descrição *</label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descreva o projeto, objetivos e escopo"
                rows={4}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Data de Início</label>
                <input
                  type="date"
                  value={formData.dataInicio}
                  onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Prazo Final</label>
                <input
                  type="date"
                  value={formData.dataFim}
                  onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Etapa Atual</label>
              <select
                value={formData.etapa}
                onChange={(e) => setFormData({ ...formData, etapa: e.target.value })}
              >
                <option value="planejamento">Planejamento</option>
                <option value="desenvolvimento">Desenvolvimento</option>
                <option value="testes">Testes</option>
                <option value="revisao">Revisão</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Criando..." : "Criar Projeto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente Modal Editar Projeto
function EditarProjetoModal({ projeto, onClose, onSuccess, onError }) {
  const [formData, setFormData] = useState({
    titulo: projeto.titulo || "",
    descricao: projeto.descricao || "",
    status: projeto.status || "em_andamento",
    dataInicio: projeto.dataInicio ? projeto.dataInicio.split("T")[0] : "",
    dataFim: projeto.dataFim ? projeto.dataFim.split("T")[0] : "",
    etapa: projeto.etapa || "planejamento",
    resultados: projeto.resultados || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/api/projetos/${projeto.id}`, formData);
      onSuccess();
    } catch (error) {
      onError(error.response?.data?.message || "Erro ao atualizar projeto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Editar Projeto</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Título do Projeto</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Descrição</label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                rows={4}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="em_andamento">Em Andamento</option>
                  <option value="concluido">Concluído</option>
                  <option value="pausado">Pausado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
              <div className="form-group">
                <label>Etapa</label>
                <select
                  value={formData.etapa}
                  onChange={(e) => setFormData({ ...formData, etapa: e.target.value })}
                >
                  <option value="planejamento">Planejamento</option>
                  <option value="desenvolvimento">Desenvolvimento</option>
                  <option value="testes">Testes</option>
                  <option value="revisao">Revisão</option>
                  <option value="finalizado">Finalizado</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Data de Início</label>
                <input
                  type="date"
                  value={formData.dataInicio}
                  onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Prazo Final</label>
                <input
                  type="date"
                  value={formData.dataFim}
                  onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Resultados / Observações</label>
              <textarea
                value={formData.resultados}
                onChange={(e) => setFormData({ ...formData, resultados: e.target.value })}
                placeholder="Registre resultados experimentais e observações"
                rows={4}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente Modal Detalhes do Projeto
function DetalhesProjetoModal({ projeto, isAdmin, currentUserId, onClose, onUpload, onRefresh, showSuccess, showError }) {
  const [activeTab, setActiveTab] = useState("info");
  const [arquivos, setArquivos] = useState(projeto.arquivos || []);
  const [loadingDownload, setLoadingDownload] = useState(null);

  const canManageFiles = isAdmin || projeto.criadorId === currentUserId || projeto.responsavelId === currentUserId;

  const handleDownload = async (arquivo) => {
    setLoadingDownload(arquivo.id);
    try {
      const response = await api.get(`/api/projetos/${projeto.id}/arquivos/${arquivo.id}/download`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", arquivo.nomeOriginal || arquivo.file);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showError("Erro ao baixar arquivo");
    } finally {
      setLoadingDownload(null);
    }
  };

  const handleDeleteArquivo = async (arquivoId) => {
    if (!window.confirm("Deseja excluir este arquivo?")) return;
    try {
      await api.delete(`/api/projetos/${projeto.id}/arquivos/${arquivoId}`);
      setArquivos(arquivos.filter((a) => a.id !== arquivoId));
      showSuccess("Arquivo excluído com sucesso");
      onRefresh();
    } catch (error) {
      showError(error.response?.data?.message || "Erro ao excluir arquivo");
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const getEtapaLabel = (etapa) => {
    const labels = {
      planejamento: "Planejamento",
      desenvolvimento: "Desenvolvimento",
      testes: "Testes",
      revisao: "Revisão",
      finalizado: "Finalizado",
    };
    return labels[etapa] || etapa;
  };

  const getStatusLabel = (status) => {
    const labels = {
      em_andamento: "Em Andamento",
      concluido: "Concluído",
      pausado: "Pausado",
      cancelado: "Cancelado",
    };
    return labels[status] || status;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content large">
        <div className="modal-header">
          <h2>{projeto.titulo}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="projeto-tabs">
          <button
            className={`projeto-tab ${activeTab === "info" ? "active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            Informações
          </button>
          <button
            className={`projeto-tab ${activeTab === "arquivos" ? "active" : ""}`}
            onClick={() => setActiveTab("arquivos")}
          >
            Arquivos ({arquivos.length})
          </button>
        </div>

        <div className="modal-body">
          {activeTab === "info" && (
            <div>
              <div className="projeto-info-grid" style={{ marginBottom: 20 }}>
                <div className="info-item">
                  <span className="info-label">Status</span>
                  <span className={`status-badge ${projeto.status}`}>
                    {getStatusLabel(projeto.status)}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Etapa</span>
                  <span className={`etapa-badge ${projeto.etapa}`}>
                    {getEtapaLabel(projeto.etapa)}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Aprovação</span>
                  <span className={`aprovacao-badge ${projeto.aprovado ? "aprovado" : "pendente"}`}>
                    {projeto.aprovado ? "Aprovado" : "Pendente"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Criador</span>
                  <span className="info-value">{projeto.criador?.nome || "-"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Responsável</span>
                  <span className="info-value">{projeto.responsavel?.nome || "-"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Data de Início</span>
                  <span className="info-value">{formatDate(projeto.dataInicio)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Prazo Final</span>
                  <span className="info-value">{formatDate(projeto.dataFim)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Criado em</span>
                  <span className="info-value">{formatDate(projeto.criadoEm)}</span>
                </div>
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <p style={{ 
                  padding: 16, 
                  background: "#f9f9f9", 
                  borderRadius: 8, 
                  lineHeight: 1.6 
                }}>
                  {projeto.descricao}
                </p>
              </div>

              {projeto.resultados && (
                <div className="form-group">
                  <label>Resultados / Observações</label>
                  <p style={{ 
                    padding: 16, 
                    background: "#f0f9f0", 
                    borderRadius: 8, 
                    lineHeight: 1.6,
                    borderLeft: "3px solid var(--cor-destaque)"
                  }}>
                    {projeto.resultados}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "arquivos" && (
            <div>
              {canManageFiles && (
                <button className="btn-primary" onClick={onUpload} style={{ marginBottom: 20 }}>
                  <Upload size={18} style={{ marginRight: 8 }} />
                  Enviar Arquivo
                </button>
              )}

              {arquivos.length === 0 ? (
                <div className="empty-state" style={{ padding: 40 }}>
                  <File size={48} className="empty-icon" />
                  <h3>Nenhum arquivo</h3>
                  <p>Este projeto ainda não possui arquivos anexados</p>
                </div>
              ) : (
                <div className="arquivos-list">
                  {arquivos.map((arquivo) => (
                    <div key={arquivo.id} className="arquivo-item">
                      <div className="arquivo-icon">
                        <FileText size={20} />
                      </div>
                      <div className="arquivo-info">
                        <h4>{arquivo.nomeOriginal || arquivo.file}</h4>
                        <p>
                          {formatFileSize(arquivo.tamanho)} • {formatDate(arquivo.criadoEm)}
                          {arquivo.user && ` • Enviado por ${arquivo.user.nome}`}
                        </p>
                        {arquivo.descricao && (
                          <p className="arquivo-descricao">{arquivo.descricao}</p>
                        )}
                      </div>
                      <div className="arquivo-actions">
                        <button
                          className="arquivo-btn"
                          onClick={() => handleDownload(arquivo)}
                          disabled={loadingDownload === arquivo.id}
                          title="Baixar arquivo"
                        >
                          <Download size={16} />
                        </button>
                        {canManageFiles && (
                          <button
                            className="arquivo-btn delete"
                            onClick={() => handleDeleteArquivo(arquivo.id)}
                            title="Excluir arquivo"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente Modal Upload de Arquivo
function UploadArquivoModal({ projeto, onClose, onSuccess, onError }) {
  const [file, setFile] = useState(null);
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      onError("Selecione um arquivo");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("arquivo", file);
      if (descricao) {
        formData.append("descricao", descricao);
      }

      await api.post(`/api/projetos/${projeto.id}/arquivos`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      onSuccess();
    } catch (error) {
      onError(error.response?.data?.message || "Erro ao enviar arquivo");
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Enviar Arquivo</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p style={{ marginBottom: 20, color: "var(--cor-texto-secundario)" }}>
              Projeto: <strong>{projeto.titulo}</strong>
            </p>

            <div
              className={`upload-area ${dragOver ? "dragover" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input").click()}
            >
              <input
                type="file"
                id="file-input"
                className="upload-input"
                onChange={handleFileSelect}
              />
              <Upload size={48} className="upload-icon" />
              {file ? (
                <>
                  <h4>{file.name}</h4>
                  <p>{formatFileSize(file.size)}</p>
                </>
              ) : (
                <>
                  <h4>Arraste um arquivo ou clique para selecionar</h4>
                  <p>PDF, DOC, XLS, imagens e outros (máx. 50MB)</p>
                </>
              )}
            </div>

            <div className="form-group" style={{ marginTop: 20 }}>
              <label>Descrição do Arquivo (opcional)</label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o conteúdo do arquivo..."
                rows={3}
              />
              <p className="form-hint">
                Adicione uma descrição para facilitar a identificação do arquivo
              </p>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading || !file}>
              {loading ? "Enviando..." : "Enviar Arquivo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
