const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../authCR/authMiddleware');
const {
  criarProjeto,
  listarProjetos,
  buscarProjeto,
  atualizarProjeto,
  aprovarProjeto,
  excluirProjeto,
  listarArquivos,
  downloadArquivo,
  excluirArquivo,
  atualizarArquivo,
  estatisticasProjetos
} = require('./projetoController');

//chama a função uploadArquivo da pasta fileCR e não da projetoController
const { uploadArquivo } = require('../FileCR/fileController');

const fileFilter = (req, file, cb) => {
  // Tipos permitidos
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'text/plain',
    'text/csv',
    'application/zip',
    'application/x-rar-compressed',
    'application/json'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido'), false);
  }
};

//guarda na memória e não no disco
const storage = multer.memoryStorage();

//limite de 50mb
const limits = { fileSize: 50 * 1024 * 1024 };

//combina tudo 
const upload = multer({ fileFilter, storage, limits });

// Middleware de tratamento de erro do multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Arquivo muito grande. Tamanho máximo: 50MB'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Erro no upload: ${err.message}`
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Rotas de projetos
router.get('/estatisticas', estatisticasProjetos);
router.get('/', listarProjetos);
router.get('/:id', buscarProjeto);
router.post('/', criarProjeto);
router.put('/:id', atualizarProjeto);
router.patch('/:id/aprovar', aprovarProjeto);
router.delete('/:id', excluirProjeto);

// Rotas de arquivos do projeto
router.get('/:id/arquivos', listarArquivos);
router.post('/:id/arquivos', upload.single('arquivo'), handleMulterError, uploadArquivo);
router.get('/:id/arquivos/:arquivoId/download', downloadArquivo);
router.put('/:id/arquivos/:arquivoId', atualizarArquivo);
router.delete('/:id/arquivos/:arquivoId', excluirArquivo);

module.exports = router;