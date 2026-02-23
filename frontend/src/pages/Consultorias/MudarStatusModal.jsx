import React, { useState } from "react";
import { X, AlertCircle, Clock, CheckCircle, Zap } from "lucide-react";
import api from "../../services/api";
import "./MudarStatusModal.css";

export default function MudarStatusModal({
  consultoria,
  onClose,
  onStatusChange,
}) {
  const [newStatus, setNewStatus] = useState(consultoria.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const statusOptions = [
    {
      value: "pendente",
      label: "Pendente",
      description: "Aguardando análise",
      icon: AlertCircle,
      color: "pendente",
    },
    {
      value: "em_analise",
      label: "Em Análise",
      description: "Sendo analisada",
      icon: Zap,
      color: "em_analise",
    },
    {
      value: "confirmada",
      label: "Confirmada",
      description: "Aprovada pela equipe",
      icon: CheckCircle,
      color: "confirmada",
    },
    {
      value: "concluida",
      label: "Concluída",
      description: "Consultoria finalizada",
      icon: CheckCircle,
      color: "concluida",
    },
    {
      value: "cancelada",
      label: "Cancelada",
      description: "Solicitação cancelada",
      icon: X,
      color: "cancelada",
    },
  ];

  const handleMudarStatus = async () => {
    if (newStatus === consultoria.status) {
      onClose();
      return;
    }

    try {
      setLoading(true);
      setError("");
      await api.patch(`/api/consultorias/${consultoria.id}`, {
        status: newStatus,
      });
      onStatusChange(newStatus);
      onClose();
    } catch (err) {
      console.error("Erro ao mudar status:", err);
      setError("Erro ao mudar o status. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Alterar Status</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="consultoria-info">
            <h3>{consultoria.nome}</h3>
            <p>
              <strong>Status Atual:</strong> {consultoria.status}
            </p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="status-selection">
            <h4>Selecione o novo status:</h4>

            <div className="status-grid">
              {statusOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <div
                    key={option.value}
                    className={`status-option ${
                      newStatus === option.value ? "selected" : ""
                    } ${option.color}`}
                    onClick={() => setNewStatus(option.value)}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={newStatus === option.value}
                      onChange={() => setNewStatus(option.value)}
                    />
                    <div className="status-content">
                      <IconComponent size={24} className="status-icon" />
                      <div className="status-details">
                        <span className="status-label">{option.label}</span>
                        <span className="status-desc">{option.description}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn-confirm"
            onClick={handleMudarStatus}
            disabled={newStatus === consultoria.status || loading}
          >
            {loading ? "Alterando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
