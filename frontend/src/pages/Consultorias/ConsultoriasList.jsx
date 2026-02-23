import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Edit2, Clock, AlertCircle, ArrowLeft, CheckCircle, Zap, X as XIcon, FileText, Calendar, Download, Paperclip } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { hasPermission } from "../../utils/permissionsHelper";
import "./ConsultoriasList.css";
import VincularResponsavelModal from "./VincularResponsavelModal";
import MudarStatusModal from "./MudarStatusModal";

export default function ConsultoriasList({ userOnly = false }) {
  const navigate = useNavigate();
  const [consultorias, setConsultorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedConsultoria, setSelectedConsultoria] = useState(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showMudarStatusModal, setShowMudarStatusModal] = useState(false);
  const [selectedConsultoriaForStatus, setSelectedConsultoriaForStatus] = useState(null);
  const [expandedConsultoria, setExpandedConsultoria] = useState(null);
  const [arquivosConsultoria, setArquivosConsultoria] = useState({});
  const [loadingArquivos, setLoadingArquivos] = useState({});

  const currentUser = api.auth.getCurrentUser();
  const canManageConsultorias = hasPermission(currentUser, "consultations:update");

  useEffect(() => {
    fetchConsultorias();
  }, [statusFilter, currentPage, itemsPerPage, userOnly]);

  const fetchConsultorias = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        ...(statusFilter && { status: statusFilter }),
        ...(userOnly && { email: currentUser?.email }),
      });

      const response = await api.get(`/api/consultorias?${params}`);
      setConsultorias(response.data.data || []);
      setTotalPages(response.data.pagination.totalPages || 1);
    } catch (error) {
      console.error("Erro ao buscar consultorias:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredConsultorias = consultorias.filter(
    (c) =>
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.empresa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openVincularModal = (consultoria) => {
    setSelectedConsultoria(consultoria);
    setShowModal(true);
  };

  const handleVincular = async (responsavelId) => {
    try {
      await api.patch(`/api/consultorias/${selectedConsultoria.id}`, {
        responsavelId,
      });
      setSuccessMessage("Responsável vinculado com sucesso!");
      setShowModal(false);
      fetchConsultorias();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Erro ao vincular responsável:", error);
    }
  };

  const openMudarStatusModal = (consultoria) => {
    setSelectedConsultoriaForStatus(consultoria);
    setShowMudarStatusModal(true);
  };

  const handleStatusChange = (newStatus) => {
    setSuccessMessage(`Status alterado para: ${getStatusLabel(newStatus)}`);
    fetchConsultorias();
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const toggleExpandConsultoria = (id) => {
    setExpandedConsultoria(expandedConsultoria === id ? null : id);
    // Carregar arquivos quando expandir
    if (expandedConsultoria !== id) {
      fetchArquivosConsultoria(id);
    }
  };

  const fetchArquivosConsultoria = async (consultoriaId) => {
    if (arquivosConsultoria[consultoriaId]) return; // Já carregou
    
    setLoadingArquivos(prev => ({ ...prev, [consultoriaId]: true }));
    try {
      const response = await api.get(`/api/consultorias/${consultoriaId}/arquivos`);
      setArquivosConsultoria(prev => ({
        ...prev,
        [consultoriaId]: response.data.data || []
      }));
    } catch (error) {
      console.error("Erro ao buscar arquivos:", error);
      setArquivosConsultoria(prev => ({
        ...prev,
        [consultoriaId]: []
      }));
    } finally {
      setLoadingArquivos(prev => ({ ...prev, [consultoriaId]: false }));
    }
  };

  const handleDownloadArquivo = async (consultoriaId, arquivoId, nomeOriginal) => {
    try {
      const response = await api.get(
        `/api/consultorias/${consultoriaId}/arquivos/${arquivoId}/download`,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', nomeOriginal || 'arquivo');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar arquivo:", error);
      alert("Erro ao baixar arquivo");
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pendente":
        return <AlertCircle size={18} className="status-icon pendente" />;
      case "em_analise":
        return <Zap size={18} className="status-icon em-analise" />;
      case "confirmada":
        return <CheckCircle size={18} className="status-icon confirmada" />;
      case "concluida":
        return <CheckCircle size={18} className="status-icon concluida" />;
      case "cancelada":
        return <XIcon size={18} className="status-icon cancelada" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pendente: "Pendente",
      em_analise: "Em Análise",
      confirmada: "Confirmada",
      concluida: "Concluída",
      cancelada: "Cancelada",
    };
    return labels[status] || status;
  };

  const getStatusDescription = (status) => {
    const descriptions = {
      pendente: "Sua solicitação foi recebida e está aguardando análise da equipe.",
      em_analise: "Nossa equipe está analisando sua solicitação e entrará em contato em breve.",
      confirmada: "Seu projeto foi aprovado e será iniciado em breve.",
      concluida: "Seu projeto foi concluído. Confira os resultados abaixo.",
      cancelada: "Esta solicitação foi cancelada.",
    };
    return descriptions[status] || "Status da solicitação";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (userOnly) {
    return (
      <div className="consultorias-container">
        <div className="consultorias-card">
          <div className="consultorias-header">
            <h1>Minhas Solicitações</h1>
            <p>Acompanhe o status das suas solicitações de orçamento</p>
          </div>

          <button
            className="back-button"
            onClick={() => navigate("/menu")}
            type="button"
          >
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </button>

          {successMessage && (
            <div className="success-message">
              ✓ {successMessage}
            </div>
          )}

          <div className="consultorias-controls">
            <div className="search-box">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar por empresa ou descrição..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>

            <div className="filters-group">
              <div className="dropdown-container">
                <button
                  className="filter-button"
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                >
                  {statusFilter ? getStatusLabel(statusFilter) : "Todos os Status"}
                  <ChevronDown size={18} />
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
                      Todos os Status
                    </button>
                    {["pendente", "em_analise", "confirmada", "concluida", "cancelada"].map(
                      (status) => (
                        <button
                          key={status}
                          className={`dropdown-item ${statusFilter === status ? "active" : ""}`}
                          onClick={() => {
                            setStatusFilter(status);
                            setShowStatusDropdown(false);
                            setCurrentPage(1);
                          }}
                        >
                          {getStatusLabel(status)}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading">Carregando suas consultorias...</div>
          ) : filteredConsultorias.length === 0 ? (
            <div className="empty-state">
              <FileText size={64} className="empty-icon" />
              <h3>Nenhuma consultoria encontrada</h3>
              <p>Você ainda não possui solicitações de consultoria.</p>
              <button 
                className="btn-primary"
                onClick={() => navigate("/menu/form-consultoria")}
              >
                Solicitar Consultoria
              </button>
            </div>
          ) : (
            <>
              <div className="consultorias-grid-cliente">
                {filteredConsultorias.map((consultoria) => (
                  <div key={consultoria.id} className="consultoria-card-cliente">
                    <div className="consultoria-card-header">
                      <div className="consultoria-card-title">
                        <h3>{consultoria.empresa}</h3>
                        <span className="consultoria-date">
                          <Calendar size={14} />
                          Solicitado em {formatDate(consultoria.criadoEm)}
                        </span>
                      </div>
                      <span className={`status-badge-large ${consultoria.status}`}>
                        {getStatusIcon(consultoria.status)}
                        {getStatusLabel(consultoria.status)}
                      </span>
                    </div>

                    <div className="consultoria-card-body">
                      <p className="status-description">
                        {getStatusDescription(consultoria.status)}
                      </p>

                      <div className="consultoria-info-grid">
                        <div className="info-item">
                          <span className="info-label">Solicitante:</span>
                          <span className="info-value">{consultoria.nome}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Email:</span>
                          <span className="info-value">{consultoria.email}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Telefone:</span>
                          <span className="info-value">{consultoria.telefone}</span>
                        </div>
                        {consultoria.responsavel && (
                          <div className="info-item">
                            <span className="info-label">Responsável:</span>
                            <span className="info-value">{consultoria.responsavel.nome}</span>
                          </div>
                        )}
                      </div>

                      <button
                        className="btn-expand"
                        onClick={() => toggleExpandConsultoria(consultoria.id)}
                      >
                        {expandedConsultoria === consultoria.id ? "Ver menos" : "Ver detalhes"}
                        <ChevronDown 
                          size={16} 
                          className={expandedConsultoria === consultoria.id ? "rotated" : ""}
                        />
                      </button>

                      {expandedConsultoria === consultoria.id && (
                        <div className="consultoria-details">
                          <h4>Descrição da Solicitação:</h4>
                          <p className="description-text">{consultoria.descricao}</p>
                          
                          {consultoria.observacoes && (
                            <>
                              <h4>Observações da Equipe:</h4>
                              <p className="observacoes-text">{consultoria.observacoes}</p>
                            </>
                          )}

                          {consultoria.dataAtendimento && (
                            <div className="info-item">
                              <span className="info-label">Data de Atendimento:</span>
                              <span className="info-value">
                                {formatDateTime(consultoria.dataAtendimento)}
                              </span>
                            </div>
                          )}

                          {/* Seção de Arquivos Anexados */}
                          <div className="arquivos-section">
                            <h4>
                              <Paperclip size={16} />
                              Arquivos Anexados
                            </h4>
                            {loadingArquivos[consultoria.id] ? (
                              <p className="loading-arquivos">Carregando arquivos...</p>
                            ) : arquivosConsultoria[consultoria.id]?.length > 0 ? (
                              <ul className="arquivos-list">
                                {arquivosConsultoria[consultoria.id].map((arquivo) => (
                                  <li key={arquivo.id} className="arquivo-item">
                                    <div className="arquivo-info">
                                      <FileText size={16} />
                                      <span className="arquivo-nome">{arquivo.nomeOriginal}</span>
                                      <span className="arquivo-tamanho">
                                        ({formatFileSize(arquivo.tamanho)})
                                      </span>
                                    </div>
                                    <button
                                      className="btn-download-arquivo"
                                      onClick={() => handleDownloadArquivo(
                                        consultoria.id,
                                        arquivo.id,
                                        arquivo.nomeOriginal
                                      )}
                                      title="Baixar arquivo"
                                    >
                                      <Download size={16} />
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="sem-arquivos">Nenhum arquivo anexado</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-button"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                  <span className="pagination-info">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    className="pagination-button"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Próximo
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="consultorias-container">
      <div className="consultorias-card">
        <div className="consultorias-header">
          <h1>Solicitações de Orçamento</h1>
          <p>Gerencie e acompanhe as solicitações recebidas</p>
        </div>

        <button
          className="back-button"
          onClick={() => navigate("/menu")}
          type="button"
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>

        {successMessage && (
          <div className="success-message">
            ✓ {successMessage}
          </div>
        )}

        <div className="consultorias-controls">
          <div className="search-box">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por nome, email ou empresa..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          <div className="filters-group">
            <div className="dropdown-container">
              <button
                className="filter-button"
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              >
                {statusFilter ? getStatusLabel(statusFilter) : "Todos os Status"}
                <ChevronDown size={18} />
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
                    Todos os Status
                  </button>
                  {["pendente", "em_analise", "confirmada", "concluida", "cancelada"].map(
                    (status) => (
                      <button
                        key={status}
                        className={`dropdown-item ${statusFilter === status ? "active" : ""}`}
                        onClick={() => {
                          setStatusFilter(status);
                          setShowStatusDropdown(false);
                          setCurrentPage(1);
                        }}
                      >
                        {getStatusLabel(status)}
                      </button>
                    )
                  )}
                </div>
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
                    {[10, 30, 50].map((num) => (
                      <button
                        key={num}
                        className={`dropdown-item ${itemsPerPage === num ? "active" : ""}`}
                        onClick={() => {
                          setItemsPerPage(num);
                          setShowPerPageDropdown(false);
                          setCurrentPage(1);
                        }}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <>
            <div className="consultorias-table-container">
              <table className="consultorias-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Empresa</th>
                    <th>Status</th>
                    <th>Responsável</th>
                    <th>Data</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredConsultorias.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="no-results">
                        Nenhuma solicitação encontrada
                      </td>
                    </tr>
                  ) : (
                    filteredConsultorias.map((consultoria) => (
                      <tr key={consultoria.id}>
                        <td className="consultoria-name">{consultoria.nome}</td>
                        <td>{consultoria.email}</td>
                        <td>{consultoria.empresa}</td>
                        <td>
                          <span className={`status-badge ${consultoria.status}`}>
                            {getStatusIcon(consultoria.status)}
                            {getStatusLabel(consultoria.status)}
                          </span>
                        </td>
                        <td>
                          {consultoria.responsavel ? (
                            <div className="responsavel-info">
                              <span className="responsavel-name">
                                {consultoria.responsavel.nome}
                              </span>
                            </div>
                          ) : (
                            <span className="sem-responsavel">Sem responsável</span>
                          )}
                        </td>
                        <td>{formatDate(consultoria.criadoEm)}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-button"
                              onClick={() => openMudarStatusModal(consultoria)}
                              title="Alterar status"
                            >
                              <Clock size={16} />
                            </button>
                            <button
                              className="action-button"
                              onClick={() => openVincularModal(consultoria)}
                              title="Vincular responsável"
                            >
                              <Edit2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-button"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
                <span className="pagination-info">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  className="pagination-button"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Próximo
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && selectedConsultoria && (
        <VincularResponsavelModal
          consultoria={selectedConsultoria}
          onClose={() => setShowModal(false)}
          onVincular={handleVincular}
          currentUser={currentUser}
        />
      )}

      {showMudarStatusModal && selectedConsultoriaForStatus && (
        <MudarStatusModal
          consultoria={selectedConsultoriaForStatus}
          onClose={() => setShowMudarStatusModal(false)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}