const { validators } = require('./validators');

const validateConsultoria = (req, res, next) => {
  const { nome, email, telefone, empresa, descricao, consentimento } = req.body;
  const errors = [];

  // Validar nome
  if (!validators.isNotEmpty(nome)) {
    errors.push({ field: 'nome', message: 'Nome é obrigatório' });
  } else if (nome.trim().length < 3) {
    errors.push({ field: 'nome', message: 'Nome deve ter no mínimo 3 caracteres' });
  }

  // Validar e-mail
  if (!validators.isNotEmpty(email)) {
    errors.push({ field: 'email', message: 'E-mail é obrigatório' });
  } else if (!validators.isValidEmail(email)) {
    errors.push({ field: 'email', message: 'E-mail inválido' });
  }

  // Validar telefone
  if (!validators.isNotEmpty(telefone)) {
    errors.push({ field: 'telefone', message: 'Telefone é obrigatório' });
  } else if (!validators.isValidPhone(telefone)) {
    errors.push({ field: 'telefone', message: 'Telefone inválido' });
  }

  // Validar empresa
  if (!validators.isNotEmpty(empresa)) {
    errors.push({ field: 'empresa', message: 'Nome da empresa é obrigatório' });
  }

  // Validar descrição
  if (!validators.isNotEmpty(descricao)) {
    errors.push({ field: 'descricao', message: 'Descrição é obrigatória' });
  } else if (!validators.isValidLength(descricao, 50)) {
    errors.push({ 
      field: 'descricao', 
      message: 'Descrição deve ter no mínimo 50 caracteres' 
    });
  }

  // Validar consentimento
  if (consentimento !== true) {
    errors.push({ 
      field: 'consentimento', 
      message: 'É necessário concordar com os termos' 
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Erro de validação',
      errors
    });
  }

  req.body.nome = validators.sanitizeString(nome);
  req.body.email = validators.sanitizeString(email).toLowerCase();
  req.body.telefone = validators.sanitizeString(telefone);
  req.body.empresa = validators.sanitizeString(empresa);
  req.body.descricao = validators.sanitizeString(descricao);

  next();
};

const validateQueryParams = (req, res, next) => {
  const { page, limit, status } = req.query;

  // Validar página
  if (page && (isNaN(page) || Number(page) < 1)) {
    return res.status(400).json({
      success: false,
      message: 'Página inválida'
    });
  }

  // Validar limite
  if (limit && (isNaN(limit) || Number(limit) < 1 || Number(limit) > 100)) {
    return res.status(400).json({
      success: false,
      message: 'Limite deve ser entre 1 e 100'
    });
  }

  // Validar status
  const validStatuses = ['pendente', 'em_analise', 'em_atendimento', 'confirmada', 'concluida', 'cancelada'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Status inválido. Use: ${validStatuses.join(', ')}`
    });
  }

  next();
};

module.exports = {
  validateConsultoria,
  validateQueryParams
};