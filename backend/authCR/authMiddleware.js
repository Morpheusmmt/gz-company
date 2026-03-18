const JWT_SECRET = process.env.JWT_SECRET || "4ca88861388a21375c08e5594ad702b20efd0a31e3d3297f067077c8325e5b50";
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token ausente ou inválido" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    });
    
    // Busca o usuário com os roles do banco de dados
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.id },
      include: {
        userRoles: {
          include: { role: true }
        }
      }
    });

    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    if (!user.status) {
      return res.status(401).json({ message: "Usuário inativo" });
    }

    // Adiciona dados completos do usuário ao request
    req.user = {
      id: user.id,
      email: user.email,
      usuario: user.usuario,
      nome: user.nome,
      roles: user.userRoles.map(ur => ({
        id: ur.role.id,
        nome: ur.role.nome
      }))
    };
    
    next();
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    res.status(401).json({ message: "Token inválido" });
  }
};

module.exports = authMiddleware;