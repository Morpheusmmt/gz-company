# 🚀 GZ Company - Sistema de Consultoria em Tecnologia

<p align="center">
  <img src="frontend/public/logo.png" alt="GZ Company Logo" width="200"/>
</p>

## 📋 Visão Geral

O **GZ Company** é uma plataforma web escalável para gerenciamento de consultorias em tecnologia. O sistema permite que usuários solicitem consultorias, acompanhem projetos e gerenciem suas contas, enquanto administradores podem gerenciar todo o ciclo de vida das consultorias.

### Funcionalidades Principais

- ✅ **Autenticação e Autorização** - Sistema completo com múltiplos perfis (usuário/admin)
- ✅ **Gerenciamento de Consultorias** - CRUD completo com status e histórico
- ✅ **Sistema de Projetos** - Acompanhamento de projetos vinculados às consultorias
- ✅ **Perfis de Usuário** - Gestão de dados pessoais e preferências
- ✅ **Recuperação de Senha** - Fluxo completo via e-mail
- ✅ **Sistema de Roles e Permissões** - Controle granular de acesso

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ARQUITETURA EM NUVEM                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌──────────────┐         ┌──────────────┐         ┌────────────┐ │
│   │   Frontend   │  HTTP   │   Backend    │   SQL   │  Database  │ │
│   │    (React)   │◄───────►│   (Express)  │◄───────►│ (Postgres) │ │
│   │   Vercel/    │   API   │   Render/    │  Prisma │  Supabase/ │ │
│   │   Netlify    │  REST   │   Railway    │   ORM   │    RDS     │ │
│   └──────────────┘         └──────────────┘         └────────────┘ │
│         │                         │                                  │
│         │ Deploy                  │ Docker Container                │
│         ▼                         ▼                                  │
│   ┌──────────────────────────────────────────────────────────────┐ │
│   │                    GitHub Actions CI/CD                       │ │
│   │   Build → Test → Docker Build → Deploy                        │ │
│   └──────────────────────────────────────────────────────────────┘ │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tecnologias Utilizadas

### Frontend
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| React | 19.x | Framework UI |
| Vite | 7.x | Build tool |
| React Router | 7.x | Roteamento |
| Axios | 1.x | Cliente HTTP |
| Lucide React | - | Ícones |

### Backend
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| Node.js | 20.x | Runtime |
| Express | 5.x | Framework Web |
| Prisma | 5.x | ORM |
| JWT | 9.x | Autenticação |
| Bcrypt | 6.x | Criptografia |
| Nodemailer | 7.x | Envio de e-mails |

### DevOps & Cloud
| Tecnologia | Descrição |
|------------|-----------|
| Docker | Containerização do backend |
| GitHub Actions | CI/CD Pipeline |
| Vercel/Netlify | Deploy do frontend |
| Render/Railway | Deploy do backend |
| Supabase/PostgreSQL | Banco de dados gerenciado |

---

## 📁 Estrutura do Projeto

```
gz-company/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # Pipeline CI/CD
├── backend/
│   ├── Dockerfile             # Container do backend
│   ├── .dockerignore
│   ├── package.json
│   ├── index.js               # Entry point
│   ├── authCR/                # Autenticação
│   │   ├── authController.js
│   │   ├── authMiddleware.js
│   │   └── authRoutes.js
│   ├── consultoriaCR/         # Consultorias
│   ├── FileCR/                # Upload de arquivos
│   ├── ProjetoCR/             # Projetos
│   ├── RolesCR/               # Roles e permissões
│   ├── UsersCR/               # Usuários
│   └── prisma/
│       ├── schema.prisma      # Schema do banco
│       └── migrations/        # Migrações
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── public/
│   │   └── logo.png
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── components/        # Componentes reutilizáveis
│       ├── pages/             # Páginas da aplicação
│       ├── services/          # Serviços e API
│       └── utils/             # Utilitários
└── README.md
```

---

## 🚀 Começando

### Pré-requisitos

- Node.js 20+
- npm ou yarn
- Docker (opcional, para containerização)
- PostgreSQL ou conta no Supabase

### Variáveis de Ambiente

#### Backend (`.env`)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/gzcompany"
JWT_SECRET="sua-chave-secreta-jwt"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="seu-email@gmail.com"
EMAIL_PASSWORD="sua-senha-app"
EMAIL_FROM_NAME="GZ Company"
PORT=3000
```

#### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:3000
```

### Instalação Local

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/gz-company.git
cd gz-company

# Backend
cd backend
npm install
npx prisma migrate dev
npm run dev

# Frontend (em outro terminal)
cd frontend
npm install
npm run dev
```

### Usando Docker

```bash
# Build do container do backend
cd backend
docker build -t gz-company-backend .

# Executar o container
docker run -p 3000:3000 --env-file .env gz-company-backend
```

---

## 📚 API REST

A API segue os princípios RESTful. Documentação completa disponível via Swagger (quando configurado).

### Endpoints Principais

#### Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/register` | Criar conta |
| POST | `/auth/login` | Fazer login |
| POST | `/auth/recuperar-senha` | Solicitar recuperação |
| POST | `/auth/verificar-codigo` | Verificar código |
| POST | `/auth/redefinir-senha` | Redefinir senha |

#### Consultorias
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/consultorias` | Listar consultorias |
| POST | `/consultorias` | Criar consultoria |
| GET | `/consultorias/:id` | Buscar por ID |
| PUT | `/consultorias/:id` | Atualizar |
| DELETE | `/consultorias/:id` | Excluir |

#### Projetos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/projetos` | Listar projetos |
| POST | `/projetos` | Criar projeto |
| PUT | `/projetos/:id` | Atualizar |

#### Usuários
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/usuarios` | Listar usuários |
| GET | `/usuarios/:id` | Buscar por ID |
| PUT | `/usuarios/:id` | Atualizar |

---

## 🔐 Segurança

- ✅ Senhas criptografadas com bcrypt
- ✅ Autenticação via JWT
- ✅ Rotas protegidas com middleware
- ✅ Validação de dados no backend
- ✅ Variáveis de ambiente para credenciais
- ✅ Tratamento adequado de erros
- ✅ CORS configurado

---

## 🔄 CI/CD Pipeline

O projeto utiliza GitHub Actions para automação:

```yaml
Pipeline:
  1. Build - Compilação do código
  2. Lint - Verificação de padrões
  3. Test - Execução de testes
  4. Docker Build - Build da imagem
  5. Deploy - Deploy automático
```

### Execução

- **Push em `main`**: Pipeline completo com deploy
- **Push em `develop`**: Build e testes
- **Pull Request**: Validação antes do merge

---

## � Conformidade com Atividade Final - ADS/IA

Este projeto atende a todos os requisitos da **Atividade Final de Desenvolvimento de Software em Nuvem**:

### ✅ Requisitos Atendidos

| Requisito | Implementação |
|-----------|---------------|
| **4.1 Aplicação Web** | Sistema de gerenciamento de consultorias com múltiplos perfis |
| **4.2 Autenticação/Autorização** | JWT + Middleware + Sistema de Roles |
| **4.2 API RESTful documentada** | Swagger/OpenAPI disponível em `/api-docs` |
| **4.2 CRUD completo** | Consultorias, Projetos, Usuários, Roles |
| **4.2 Validação no back-end** | Módulos validators.js e validation.js |
| **4.2 Registro de logs** | Sistema de logging em `utils/logger.js` |
| **4.3 Frontend moderno** | React 19 + Vite |
| **4.3 Backend containerizado** | Dockerfile configurado |
| **5. Docker** | Dockerfile + .dockerignore |
| **5. CI/CD Pipeline** | GitHub Actions (Build → Test → Deploy) |
| **6. Variáveis de ambiente** | .env.example para backend e frontend |
| **6. Rotas protegidas** | authMiddleware.js |
| **6. Tratamento de erros** | errorHandler.js |
| **6. Separação dev/prod** | config/environment.js |
| **7. Testes automatizados** | tests/api.test.js (Backend) |
| **9.1 README detalhado** | Este documento |

### 📁 Estrutura de Entregáveis

```
✅ Código-fonte organizado
✅ Dockerfile funcional
✅ Arquivos de configuração (.env.example)
✅ README.md detalhado
✅ Pipeline CI/CD configurado
✅ Documentação Swagger
```

---

## �📦 Deploy em Nuvem

### Frontend (Vercel)
1. Conecte o repositório ao Vercel
2. Configure o diretório raiz como `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`

### Backend (Render)
1. Conecte o repositório ao Render
2. Configure como Web Service
3. Dockerfile path: `backend/Dockerfile`
4. Configure variáveis de ambiente

### Banco de Dados (Supabase)
1. Crie um projeto no Supabase
2. Copie a connection string
3. Configure no `DATABASE_URL`

---

## 🧪 Testes

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

---

## 👥 Equipe

| Papel | Responsabilidades |
|-------|-------------------|
| Arquiteto de Software | Desenho da arquitetura em nuvem |
| Desenvolvedor Backend | API REST, autenticação, banco de dados |
| Desenvolvedor Frontend | Interface do usuário, integração API |
| DevOps Engineer | Docker, CI/CD, deploy |
| QA | Testes e qualidade |

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos como parte da atividade final do curso de ADS/IA (EAD - Unifor).

---

## 📞 Contato

**GZ Company** - Soluções em Tecnologia

- 📧 Email: contato@gzcompany.com
- 🌐 Website: [gzcompany.com](https://gzcompany.com)

---

<p align="center">
  <strong>GZ Company</strong> - Transformando ideias em soluções tecnológicas 🚀
</p>
