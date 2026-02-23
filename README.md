# GZ Company

Sistema web para gerenciamento de consultorias desenvolvido como projeto final da disciplina de Desenvolvimento de Software em Nuvem.

**Demo:** https://gz-company.vercel.app  
**API:** https://gz-company.onrender.com  
**Docs:** https://gz-company.onrender.com/api-docs

## Sobre o projeto

A GZ Company é uma plataforma onde usuários podem solicitar consultorias em tecnologia. O sistema possui dois tipos de acesso: usuário comum (solicita consultorias e acompanha projetos) e administrador (gerencia consultorias, projetos e usuários).

### O que o sistema faz

- Cadastro e login com autenticação JWT
- Solicitação de consultorias com acompanhamento de status
- Gerenciamento de projetos vinculados às consultorias
- Recuperação de senha por email
- Painel administrativo para gestão completa
- Sistema de permissões por cargo

## Tecnologias

**Frontend:** React 19, Vite, React Router, Axios  
**Backend:** Node.js, Express, Prisma ORM  
**Banco:** PostgreSQL (Neon)  
**Deploy:** Vercel (front), Render (back)  
**Outros:** Docker, GitHub Actions, Swagger

## Estrutura

```
├── backend/
│   ├── authCR/          # Login, registro, recuperar senha
│   ├── consultoriaCR/   # CRUD de consultorias
│   ├── ProjetoCR/       # CRUD de projetos
│   ├── UsersCR/         # Gerenciamento de usuários
│   ├── RolesCR/         # Cargos e permissões
│   ├── prisma/          # Schema e migrations
│   └── Dockerfile
│
├── frontend/
│   └── src/
│       ├── pages/       # Telas da aplicação
│       ├── components/  # Componentes reutilizáveis
│       └── services/    # Chamadas à API
│
└── .github/workflows/   # CI/CD
```

## Rodando local

Precisa ter Node.js 20+ e um banco PostgreSQL.

```bash
# Clonar
git clone https://github.com/Morpheusmmt/gz-company.git
cd gz-company

# Backend
cd backend
cp .env.example .env
# editar .env com suas credenciais
npm install
npx prisma migrate dev
npm run dev

# Frontend (outro terminal)
cd frontend
npm install
npm run dev
```

Acesse http://localhost:5173

## Variáveis de ambiente

**Backend (.env):**
```
DATABASE_URL=postgresql://...
JWT_SECRET=chave_secreta
EMAIL_USER=email@gmail.com
EMAIL_PASSWORD=senha_app
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:3000
```

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /auth/register | Criar conta |
| POST | /auth/login | Login |
| GET | /consultorias | Listar consultorias |
| POST | /consultorias | Nova consultoria |
| GET | /projetos | Listar projetos |
| GET | /usuarios | Listar usuários |

Documentação completa em `/api-docs`

## Deploy

O frontend está no Vercel e o backend no Render. O banco é PostgreSQL hospedado no Neon.

Para fazer deploy próprio:

1. Fork o repositório
2. Crie contas no Vercel, Render e Neon
3. Configure as variáveis de ambiente em cada serviço
4. Conecte os repositórios

## Equipe

Projeto desenvolvido pelo grupo Guerreiros Saiyajin para a disciplina de Desenvolvimento de Software em Nuvem - Unifor.

## Licença

Projeto acadêmico.
