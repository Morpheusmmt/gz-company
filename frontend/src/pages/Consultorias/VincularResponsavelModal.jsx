import React, { useState, useEffect } from "react";
import { X, User } from "lucide-react";
import api from "../../services/api";
import "./VincularResponsavelModal.css";

export default function VincularResponsavelModal({
  consultoria,
  onClose,
  onVincular,
  currentUser,
}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponsavel, setSelectedResponsavel] = useState(
    consultoria.responsavel?.id || null
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users");
      setUsers(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVincular = async () => {
    if (selectedResponsavel) {
      await onVincular(selectedResponsavel);
    }
  };

  const handleRemoverResponsavel = async () => {
    await onVincular(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Vincular Responsável</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="consultoria-info">
            <h3>{consultoria.nome}</h3>
            <p>
              <strong>Email:</strong> {consultoria.email}
            </p>
            <p>
              <strong>Empresa:</strong> {consultoria.empresa}
            </p>
            {consultoria.responsavel && (
              <p className="current-responsavel">
                <strong>Responsável Atual:</strong> {consultoria.responsavel.nome}
              </p>
            )}
          </div>

          <div className="responsavel-selection">
            <h4>Selecione um responsável:</h4>

            {/* Botão de atribuir a si mesmo */}
            <div
              className={`responsavel-option self-assign ${
                selectedResponsavel === currentUser?.id ? "selected" : ""
              }`}
              onClick={() => setSelectedResponsavel(currentUser?.id)}
            >
              <input
                type="radio"
                name="responsavel"
                value={currentUser?.id}
                checked={selectedResponsavel === currentUser?.id}
                onChange={() => setSelectedResponsavel(currentUser?.id)}
              />
              <div className="responsavel-details">
                <span className="responsavel-name">
                  {currentUser?.nome} (Você)
                </span>
                <span className="responsavel-email">{currentUser?.email}</span>
              </div>
            </div>

            {users.length > 0 && (
              <>
                <div className="separator">Outros usuários</div>

                {loading ? (
                  <div className="loading-users">Carregando usuários...</div>
                ) : (
                  <div className="users-list">
                    {users
                      .filter((u) => u.id !== currentUser?.id)
                      .map((user) => (
                        <div
                          key={user.id}
                          className={`responsavel-option ${
                            selectedResponsavel === user.id ? "selected" : ""
                          }`}
                          onClick={() => setSelectedResponsavel(user.id)}
                        >
                          <input
                            type="radio"
                            name="responsavel"
                            value={user.id}
                            checked={selectedResponsavel === user.id}
                            onChange={() => setSelectedResponsavel(user.id)}
                          />
                          <div className="responsavel-details">
                            <span className="responsavel-name">{user.nome}</span>
                            <span className="responsavel-email">{user.email}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </>
            )}

            {/* Opção de remover responsável */}
            <div
              className={`responsavel-option remove-option ${
                selectedResponsavel === null ? "selected" : ""
              }`}
              onClick={() => setSelectedResponsavel(null)}
            >
              <input
                type="radio"
                name="responsavel"
                value="none"
                checked={selectedResponsavel === null}
                onChange={() => setSelectedResponsavel(null)}
              />
              <div className="responsavel-details">
                <span className="responsavel-name">Sem responsável</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn-confirm"
            onClick={handleVincular}
            disabled={selectedResponsavel === consultoria.responsavel?.id}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
