const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GZ Company API',
      version: '1.0.0',
      description: 'API RESTful para o sistema de consultoria da GZ Company - Soluções em Tecnologia',
      contact: {
        name: 'GZ Company',
        email: 'contato@gzcompany.com',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT de autenticação',
        },
      },
      schemas: {
        Usuario: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do usuário',
            },
            nome: {
              type: 'string',
              description: 'Nome completo do usuário',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário',
            },
            roleId: {
              type: 'integer',
              description: 'ID da role do usuário',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Consultoria: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único da consultoria',
            },
            nome: {
              type: 'string',
              description: 'Nome do solicitante',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email de contato',
            },
            telefone: {
              type: 'string',
              description: 'Telefone de contato',
            },
            empresa: {
              type: 'string',
              description: 'Nome da empresa',
            },
            descricao: {
              type: 'string',
              description: 'Descrição da consultoria solicitada',
            },
            status: {
              type: 'string',
              enum: ['PENDENTE', 'EM_ANALISE', 'APROVADA', 'REJEITADA', 'CONCLUIDA'],
              description: 'Status atual da consultoria',
            },
            userId: {
              type: 'integer',
              description: 'ID do usuário que criou',
            },
            responsavelId: {
              type: 'integer',
              nullable: true,
              description: 'ID do responsável pela consultoria',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Projeto: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do projeto',
            },
            titulo: {
              type: 'string',
              description: 'Título do projeto',
            },
            descricao: {
              type: 'string',
              description: 'Descrição do projeto',
            },
            status: {
              type: 'string',
              enum: ['ATIVO', 'PAUSADO', 'CONCLUIDO', 'CANCELADO'],
              description: 'Status do projeto',
            },
            consultoriaId: {
              type: 'integer',
              description: 'ID da consultoria vinculada',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Role: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único da role',
            },
            nome: {
              type: 'string',
              description: 'Nome da role',
            },
            permissoes: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Lista de permissões',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'usuario@email.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'senha123',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['nome', 'email', 'password'],
          properties: {
            nome: {
              type: 'string',
              example: 'João Silva',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'joao@email.com',
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 6,
              example: 'senha123',
            },
          },
        },
        ConsultoriaRequest: {
          type: 'object',
          required: ['nome', 'email', 'telefone', 'empresa', 'descricao', 'consentimento'],
          properties: {
            nome: {
              type: 'string',
              example: 'Maria Santos',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'maria@empresa.com',
            },
            telefone: {
              type: 'string',
              example: '(85) 99999-9999',
            },
            empresa: {
              type: 'string',
              example: 'Empresa XYZ Ltda',
            },
            descricao: {
              type: 'string',
              example: 'Preciso de consultoria para desenvolvimento de sistema web',
            },
            consentimento: {
              type: 'boolean',
              example: true,
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Erro ao processar requisição',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
            },
            data: {
              type: 'object',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Autenticação',
        description: 'Endpoints de autenticação e gerenciamento de sessão',
      },
      {
        name: 'Usuários',
        description: 'Gerenciamento de usuários do sistema',
      },
      {
        name: 'Consultorias',
        description: 'Gerenciamento de solicitações de consultoria',
      },
      {
        name: 'Projetos',
        description: 'Gerenciamento de projetos',
      },
      {
        name: 'Roles',
        description: 'Gerenciamento de roles e permissões',
      },
    ],
  },
  apis: ['./swagger/*.js'], // Arquivos com documentação das rotas
};

const specs = swaggerJsdoc(options);

module.exports = specs;
