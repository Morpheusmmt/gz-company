const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swagger/swaggerConfig");
const { errorHandler, notFound } = require("./consultoriaCR/errorHandler"); 
const authMiddleware = require("./authCR/authMiddleware");
const { logger, requestLogger } = require("./utils/logger");

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173', 
  credentials: true
}));

// Middleware de logging
app.use(requestLogger);

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "GZ Company API - Documentação"
}));

app.get("/", (req, res) => {
  res.send(`
    <h1>🚀 GZ Company API</h1>
    <p>Bem-vindo à API da GZ Company!</p>
    <p>📚 Acesse a documentação: <a href="/api-docs">/api-docs</a></p>
    <p>🔧 Ambiente: ${NODE_ENV}</p>
  `);
});

const authRoutes = require("./authCR/authRoutes");
const consultoriaRoutes = require("./consultoriaCR/consultoriaRoutes");
const usersRoutes = require("./UsersCR/UsersRoutes");
const rolesRoutes = require("./RolesCR/RolesRoutes");
const projetoRoutes = require("./ProjetoCR/projetoRoutes");

app.use("/", authRoutes); 
app.use('/api/consultorias', consultoriaRoutes);
app.use("/users", authMiddleware, usersRoutes);
app.use("/roles", authMiddleware, rolesRoutes);
app.use("/api/projetos", projetoRoutes);

// Middlewares de erro 
app.use(notFound);
app.use(errorHandler);

// Início do servidor
app.listen(PORT, () => {
  logger.info(`Servidor iniciado`, { port: PORT, env: NODE_ENV });
  logger.info(`Documentação disponível em /api-docs`);
});

process.on("beforeExit", async () => {
  logger.info('Encerrando conexão com banco de dados');
  await prisma.$disconnect();
});