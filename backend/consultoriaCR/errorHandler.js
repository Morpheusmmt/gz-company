const errorHandler = (err, req, res, next) => {
  console.error('❌ Erro:', err);

  // Erro do Prisma - Registro duplicado
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: 'Já existe um registro com estes dados',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Erro do Prisma - Registro não encontrado
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Registro não encontrado',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Erro de validação do Prisma
  if (err.code === 'P2000') {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos fornecidos',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Erro padrão
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

// Middleware para rotas não encontradas
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Rota não encontrada: ${req.method} ${req.originalUrl}`
  });
};

module.exports = {
  errorHandler,
  notFound
};