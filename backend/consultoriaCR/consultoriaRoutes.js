const express = require('express');
const multer = require('multer');
const { 
  criarConsultoria, 
  listarConsultorias, 
  buscarConsultoria,
  atualizarStatus,
  atualizarConsultoria,
  deletarConsultoria,
  listarArquivosConsultoria,
  downloadArquivoConsultoria
} = require('./consultoriaController'); 
const { 
  validateConsultoria, 
  validateQueryParams 
} = require('./validation');
const authMiddleware = require('../authCR/authMiddleware');

const router = express.Router();

// Configuração do multer para armazenar em memória (Base64)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB por arquivo
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido'), false);
    }
  }
});

// Rota de criação de consultoria (requer autenticação)
router.post('/', authMiddleware, upload.array('arquivos', 5), criarConsultoria);

// Rotas de listagem (requer autenticação)
router.get('/', authMiddleware, validateQueryParams, listarConsultorias);
router.get('/:id', authMiddleware, buscarConsultoria);

// Rotas para arquivos (requer autenticação)
router.get('/:id/arquivos', authMiddleware, listarArquivosConsultoria);
router.get('/:id/arquivos/:arquivoId/download', authMiddleware, downloadArquivoConsultoria);

// Rotas de admin (requer autenticação)
router.patch('/:id/status', authMiddleware, atualizarStatus);
router.patch('/:id', authMiddleware, atualizarConsultoria);
router.delete('/:id', authMiddleware, deletarConsultoria);

module.exports = router;