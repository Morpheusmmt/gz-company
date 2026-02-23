import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ScrollText, Upload, FileText, X, Trash2 } from "lucide-react";
import api from "../../services/api"; 
import "./FormConsultoria.css";

export default function FormConsultoria() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
    descricao: "",
    consentimento: false,
  });

  const [arquivos, setArquivos] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false); 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    setError(null);
  };

  const adicionarArquivos = (novosArquivos) => {
    const listaAtualizada = [...arquivos, ...Array.from(novosArquivos)];
    setArquivos(listaAtualizada);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      adicionarArquivos(e.target.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      adicionarArquivos(e.dataTransfer.files);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removerArquivo = (indexParaRemover) => {
    setArquivos(arquivos.filter((_, index) => index !== indexParaRemover));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Arquivos para envio:", arquivos.map(a => a.name));

      // Usar FormData para enviar arquivos junto com os dados
      const formDataToSend = new FormData();
      formDataToSend.append("nome", formData.nome);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("telefone", formData.telefone);
      formDataToSend.append("empresa", formData.empresa);
      formDataToSend.append("descricao", formData.descricao);
      formDataToSend.append("consentimento", formData.consentimento);

      // Adicionar arquivos ao FormData
      arquivos.forEach((arquivo) => {
        formDataToSend.append("arquivos", arquivo);
      });

      const response = await api.post("/api/consultorias", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const msgAnexos = arquivos.length > 0 
        ? `\n(${arquivos.length} arquivo(s) enviado(s) com sucesso!)` 
        : "";

      alert("✅ " + response.data.message + msgAnexos);
      
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        empresa: "",
        descricao: "",
        consentimento: false,
      });
      setArquivos([]);

      setTimeout(() => {
        navigate("/menu");
      }, 2000);

    } catch (err) {
      const errorMessage = err.response?.data?.errors?.[0]?.message 
        || err.response?.data?.message 
        || err.message 
        || "Erro ao enviar solicitação";
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fc-container">
      <div className="fc-card">
        <button
          className="back-button"
          onClick={() => navigate("/menu")}
          type="button"
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>

        <form className="fc-form" onSubmit={handleSubmit}>
          <ScrollText size={40} color="#ffffff" />
          <h2>Solicitar Orçamento</h2>
          <p>
            Preencha os campos abaixo para solicitar um orçamento 
            para o seu projeto
          </p>

          {error && (
            <div style={{
              padding: "12px",
              marginBottom: "16px",
              backgroundColor: "#fee",
              border: "1px solid #fcc",
              borderRadius: "4px",
              color: "#c00"
            }}>
              ⚠️ {error}
            </div>
          )}

          <div className="fc-input-group">
            <input
              className="fc-input"
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Nome completo"
              required
            />
            <input
              className="fc-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="E-mail"
              required
            />
            <input
              className="fc-input"
              type="text"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="Telefone / WhatsApp"
              required
            />
            <input
              className="fc-input"
              type="text"
              name="empresa"
              value={formData.empresa}
              onChange={handleChange}
              placeholder="Nome da sua empresa"
              required
            />
            <textarea
              className="fc-input"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descreva seu projeto e o que você precisa (mínimo 50 caracteres)"
              rows={6}
              minLength={50}
              required
              style={{resize: "vertical"}}
            ></textarea>

            <div 
              className="fc-input"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragLeave={handleDragLeave}
              style={{
                borderStyle: 'dashed', 
                backgroundColor: isDragging ? '#e6fffa' : '#f9f9f9',
                borderColor: isDragging ? '#22c55e' : '#ccc',
                padding: '20px', 
                height: 'auto',
                transition: 'all 0.2s ease'
              }}
            >
              <input 
                id="file-upload" 
                type="file" 
                onChange={handleFileChange} 
                style={{display: 'none'}} 
                multiple
                accept=".pdf,.doc,.docx,.jpg,.png"
              />
              
              <label 
                htmlFor="file-upload" 
                style={{
                  cursor: 'pointer', 
                  width: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  color: '#666',
                  marginBottom: arquivos.length > 0 ? '15px' : '0'
                }}
              >
                <Upload size={32} color={isDragging ? "#22c55e" : "#9ca3af"} style={{marginBottom: '8px'}} />
                <span style={{fontWeight: '500', color: isDragging ? "#15803d" : "inherit"}}>
                  {isDragging ? "Solte os arquivos aqui!" : "Clique ou arraste arquivos aqui"}
                </span>
                <small style={{fontSize: '0.8rem', color: '#9ca3af'}}>PDF, DOC, Imagens (Vários permitidos)</small>
              </label>

              {arquivos.length > 0 && (
                <div style={{
                  marginTop: '10px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '8px',
                  borderTop: '1px solid #eee',
                  paddingTop: '10px'
                }}>
                  {arquivos.map((arq, index) => (
                    <div key={index} style={{
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      background: 'white',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #e5e7eb',
                      fontSize: '0.9rem'
                    }}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden'}}>
                        <FileText size={16} color="#15803d" />
                        <span style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px'}}>
                          {arq.name}
                        </span>
                        <small style={{color: '#999'}}>({(arq.size / 1024).toFixed(0)} KB)</small>
                      </div>
                      
                      <button 
                        type="button"
                        onClick={() => removerArquivo(index)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer', 
                          color: '#ef4444', display: 'flex', alignItems: 'center'
                        }}
                        title="Remover arquivo"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

            </div>

            <label style={{marginTop: '15px', display: 'flex', gap: '10px', alignItems: 'start', textAlign: 'left'}}>
              <input
                className="fc-checkbox"
                type="checkbox"
                name="consentimento"
                checked={formData.consentimento}
                onChange={handleChange}
                required
                style={{marginTop: '4px'}}
              />
              <span style={{fontSize: '0.9rem', color: '#555'}}>
                Concordo que meus dados serão usados apenas para fins de contato e proposta de consultoria.
              </span>
            </label>
          </div>

          <button 
            type="submit" 
            className="botao-confirmar" 
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar Solicitação"}
          </button>
        </form>
      </div>
    </div>
  );
}