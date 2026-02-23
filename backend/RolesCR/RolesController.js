  // Admin
  'users:create', 'users:edit', 'users:delete', 'users:view_all',
  'roles:manage', 'projects:view_all', 'consultations:view_all',
  'reports:generate', 'system:config',
  
  // Desenvolvedor
  'projects:create', 'projects:edit', 'projects:view_own',
  'consultations:update', 'consultations:view',
  'files:upload', 'reports:export',
  
  // Cliente
  'consultations:create', 'consultations:view_own', 'files:upload', 'profile:edit'

const roles = [
  {
    id: 1,
    nome: "Administrador",
    descricao: "Administrador do sistema",
    permissoes: [
      "users:create", "users:edit", "users:delete", "users:view_all",
      "roles:manage", "projects:view_all", "consultations:view_all", 
      "reports:generate", "system:config"
    ],
    ativo: true
  },
  {
    id: 2,
    nome: "DESENVOLVEDOR",
    descricao: "Gerenciador de projetos e serviços",
    permissoes: [
      "projects:create", "projects:edit", "projects:view_own",
      "consultations:update", "consultations:view",
      "files:upload", "reports:export"
    ],
    ativo: true
  },
  {
    id: 3,
    nome: "CLIENTE",
    descricao: "Só ve suas próprias consultorias",
    permissoes: [
      "consultations:create", "consultations:view_own", 
      "files:upload", "profile:edit"
    ],
    ativo: true
  }
];

// FUNÇÕES DE ERRO 
const validationError = (res, message) => {
  return res.status(400).json({
    success: false,
    error: message,
    code: "VALIDATION_ERROR"
  });
};

const notFoundError = (res, resource = "Role") => {
  return res.status(404).json({
    success: false,
    error: `${resource} não encontrado`,
    code: "NOT_FOUND"
  });
};

const conflictError = (res, message) => {
  return res.status(409).json({
    success: false,
    error: message,
    code: "CONFLICT"
  });
};

// CREATE - Criar novo role
exports.createRole = (req, res) => {
  const { nome, descricao, permissoes } = req.body;

  // Validações básicas
  if (!nome || !descricao) {
    return validationError(res, "Nome e descrição são obrigatórios");
  }

  if (permissoes && !Array.isArray(permissoes)) {
    return validationError(res, "Permissões deve ser um array");
  }

  // VALIDAÇÃO DE PERMISSÕES
  if (permissoes) {
    const invalidPermissions = permissoes.filter(p => !validPermissions.includes(p));
    
    if (invalidPermissions.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Permissões inválidas: ${invalidPermissions.join(', ')}`,
        validPermissions: validPermissions,
        code: "INVALID_PERMISSIONS"
      });
    }
  }

  // Verifica se nome já existe 
  const roleExists = roles.find(role => role.nome === nome);
  if (roleExists) {
    return conflictError(res, "Já existe um role com este nome");
  }

  // Cria novo role
  const newRole = {
    id: roles.length + 1,
    nome,
    descricao,
    permissoes: permissoes || [],
    ativo: true
  };

  roles.push(newRole);
  
  res.status(201).json({
    success: true,
    data: newRole,
    message: "Role criado com sucesso"
  });
};

// READ - Listar todos os roles COM FILTROS
exports.getAllRoles = (req, res) => {
  let filteredRoles = [...roles];
  
  if (req.query.ativo !== undefined) {
    const ativo = req.query.ativo === 'true';
    filteredRoles = filteredRoles.filter(role => role.ativo === ativo);
  }
  
  if (req.query.nome) {
    const termoBusca = req.query.nome.toLowerCase();
    filteredRoles = filteredRoles.filter(role => 
      role.nome.toLowerCase().includes(termoBusca)
    );
  }
  
  if (req.query.permisao) {
    filteredRoles = filteredRoles.filter(role =>
      role.permissoes.includes(req.query.permisao)
    );
  }

  res.json({
    success: true,
    count: filteredRoles.length,
    filters: {
      ativo: req.query.ativo,
      nome: req.query.nome,
      permisao: req.query.permisao
    },
    data: filteredRoles
  });
};

// READ - Buscar role por ID
exports.getRoleById = (req, res) => {
  const role = roles.find(r => r.id === parseInt(req.params.id));
  
  if (!role) {
    return notFoundError(res, "Role");
  }

  res.json({
    success: true,
    data: role
  });
};

// READ - Buscar role por nome
exports.getRoleByName = (req, res) => {
  const role = roles.find(r => r.nome === req.params.nome);
  
  if (!role) {
    return notFoundError(res, "Role");
  }

  res.json({
    success: true,
    data: role
  });
};

// UPDATE - Atualizar role
exports.updateRole = (req, res) => {
  const roleIndex = roles.findIndex(r => r.id === parseInt(req.params.id));
  
  if (roleIndex === -1) {
    return notFoundError(res, "Role");
  }

  const { nome, descricao, permissoes, ativo } = req.body;

  // VALIDAÇÃO DE PERMISSÕES
  if (permissoes) {
    const invalidPermissions = permissoes.filter(p => !validPermissions.includes(p));
    
    if (invalidPermissions.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Permissões inválidas: ${invalidPermissions.join(', ')}`,
        validPermissions: validPermissions,
        code: "INVALID_PERMISSIONS"
      });
    }
  }

  // Valida nome único 
  if (nome && roles.find((r, index) => r.nome === nome && index !== roleIndex)) {
    return conflictError(res, "Já existe outro role com este nome");
  }

  // Atualiza o role
  roles[roleIndex] = {
    ...roles[roleIndex],
    ...(nome && { nome }),
    ...(descricao && { descricao }),
    ...(permissoes && { permissoes }),
    ...(ativo !== undefined && { ativo })
  };

  res.json({
    success: true,
    data: roles[roleIndex],
    message: "Role atualizado com sucesso"
  });
};

// DELETE - Deletar role 
exports.deleteRole = (req, res) => {
  const roleIndex = roles.findIndex(r => r.id === parseInt(req.params.id));
  
  if (roleIndex === -1) {
    return notFoundError(res, "Role");
  }

  roles[roleIndex].ativo = false;

  res.json({
    success: true,
    message: "Role desativado com sucesso"
  });
};

// Reativar role
exports.activateRole = (req, res) => {
  const roleIndex = roles.findIndex(r => r.id === parseInt(req.params.id));
  
  if (roleIndex === -1) {
    return notFoundError(res, "Role");
  }

  roles[roleIndex].ativo = true;

  res.json({
    success: true,
    message: "Role reativado com sucesso",
    data: roles[roleIndex]
  });
};