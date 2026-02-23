const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "4ca88861388a21375c08e5594ad702b20efd0a31e3d3297f067077c8325e5b50";
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

// Configuração do transporter para Gmail
const getEmailTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;

  if (!emailUser || !emailPassword) {
    throw new Error("EMAIL_USER e EMAIL_PASSWORD não configurados no .env");
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPassword.replace(/\s/g, '') 
    }
  });
};

const testEmailConnection = async () => {
  try {
    const transporter = getEmailTransporter();
    await transporter.verify();
    console.log("✅ Conexão com Gmail estabelecida com sucesso!");
    return true;
  } catch (error) {
    console.error("❌ Erro ao conectar com Gmail:", error.message);
    return false;
  }
};

// Sistema de registrar uma conta de usuário
exports.register = async (req, res) => {
  const { nome, usuario, email, senha } = req.body;
  
  try {
    if (!nome || !usuario || !email || !senha) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    const emailExiste = await prisma.user.findUnique({
      where: { email },
    });
    if (emailExiste) {
      return res.status(409).json({ error: "Este email já está em uso" });
    }

    const usuarioExiste = await prisma.user.findUnique({
      where: { usuario },
    });
    if (usuarioExiste) {
      return res.status(409).json({ error: "Este nome de usuário já está em uso" });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    let roleCliente = await prisma.role.findFirst({
      where: { 
        nome: {
          equals: "CLIENTE",
          mode: 'insensitive' 
        }
      }
    });

    // Cria o usuário E já adiciona a role de cliente
    const novoUsuario = await prisma.user.create({
      data: {
        nome,
        usuario,
        email,
        senha: senhaHash,
        userRoles: {
          create: {
            roleId: roleCliente.id
          }
        }
      },
      include: {
        userRoles: {
          include: { role: true }
        }
      }
    });

    const token = jwt.sign(
      {
        id: novoUsuario.id,
        email: novoUsuario.email,
        usuario: novoUsuario.usuario
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    console.log("✅ Usuário criado com sucesso:", {
      id: novoUsuario.id,
      email: novoUsuario.email,
      roles: novoUsuario.userRoles.map(ur => ur.role.nome)
    });

    res.status(201).json({
      message: "Usuário criado com sucesso!",
      token,
      user: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        usuario: novoUsuario.usuario,
        email: novoUsuario.email,
        status: novoUsuario.status,
        roles: novoUsuario.userRoles.map(ur => ({
          id: ur.role.id,
          nome: ur.role.nome
        }))
      }
    });
  } catch (error) {
    console.error("ERRO NO REGISTER:", error);
    res.status(500).json({ error: "Erro interno ao criar o usuário" });
  }
};

// Sistema de logar numa conta de usuário
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: { 
            role: true 
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    if (!user.status) {
      return res.status(401).json({ error: "Usuário inativo. Entre em contato com o administrador." });
    }

    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ error: "Senha incorreta." });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        usuario: user.usuario
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: "Login bem-sucedido!",
      token,
      user: {
        id: user.id,
        nome: user.nome,
        usuario: user.usuario,
        email: user.email,
        status: user.status,
        roles: user.userRoles.map(ur => ({
          id: ur.role.id,
          nome: ur.role.nome
        }))
      }
    });
  } catch (error) {
    console.error("ERRO NO LOGIN:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email obrigatório." });
    }

    const usuarioExistente = await prisma.user.findUnique({
      where: { email },
    });

    if (!usuarioExistente) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const codigoRecuperacao = gerarSenhaAleatoria(6);
    const hashCodigo = await bcrypt.hash(codigoRecuperacao, 10);

    const data_expiracao = new Date();
    data_expiracao.setHours(data_expiracao.getHours() + 1);

    await prisma.passwordReset.deleteMany({
      where: { email },
    });

    await prisma.passwordReset.create({
      data: {
        email: email,
        senhaAleatoria: hashCodigo,
        dataExpiracao: data_expiracao, 
        userId: usuarioExistente.id,   
      },
    });

    const templatePath = path.join(__dirname, "recuperarSenha.html");
    let htmlTemplate = fs.readFileSync(templatePath, "utf8");

    htmlTemplate = htmlTemplate
      .replace("{{NOME_USUARIO}}", usuarioExistente.nome)
      .replace("{{CODIGO_RECUPERACAO}}", codigoRecuperacao);

    try {
      const transporter = getEmailTransporter();
      
      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || 'GZ Company'}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Recuperação de senha - GZ Company",
        html: htmlTemplate,
      };

      const info = await transporter.sendMail(mailOptions);
      
      console.log("✅ Email enviado com sucesso!");
      console.log(`   Para: ${email}`);
      console.log(`   Message ID: ${info.messageId}`);
      console.log(`   Código: ${codigoRecuperacao}`);
      
      return res.status(200).json({ 
        message: "Código enviado para seu e-mail com sucesso!" 
      });
      
    } catch (emailError) {
      console.error("❌ Erro ao enviar email:", emailError);
      
      let errorMessage = "Erro ao enviar email.";
      
      if (emailError.code === 'EAUTH') {
        errorMessage = "Erro de autenticação. Verifique se você está usando uma Senha de App do Google (não a senha normal).";
      } else if (emailError.code === 'ESOCKET') {
        errorMessage = "Erro de conexão. Verifique sua conexão com a internet.";
      } else if (emailError.responseCode === 535) {
        errorMessage = "Credenciais inválidas. Use uma Senha de App do Google: https://myaccount.google.com/apppasswords";
      }
      
      return res.status(500).json({ 
        error: errorMessage,
        details: emailError.message
      });
    }

  } catch (error) {
    console.error("ERRO NO FORGOT PASSWORD:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, codigoRecuperacao, novaSenha } = req.body;

    if (!email || !codigoRecuperacao || !novaSenha) {
      return res.status(400).json({ error: "Parâmetros obrigatórios: email, codigoRecuperacao, novaSenha." });
    }

    const registro = await prisma.passwordReset.findFirst({
      where: {
        email,
        utilizado: false,
        dataExpiracao: {
          gte: new Date(),
        },
      },
    });

    if (!registro) {
      return res.status(400).json({ error: "Código inválido ou expirado." });
    }

    const codigoValido = await bcrypt.compare(codigoRecuperacao, registro.senhaAleatoria);
    if (!codigoValido) {
      return res.status(400).json({ error: "Código inválido." });
    }

    const salt = await bcrypt.genSalt(10);
    const novaSenhaHash = await bcrypt.hash(novaSenha, salt);

    await prisma.user.update({
      where: { id: registro.userId },
      data: { senha: novaSenhaHash },
    });

    await prisma.passwordReset.update({
      where: { id: registro.id },
      data: { utilizado: true },
    });

    return res.json({ message: "Senha alterada com sucesso." });
  } catch (error) {
    console.error("ERRO NO RESET PASSWORD:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

//Função que muda a senha de um usuário já logado
exports.resetPasswordLogged = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { senhaAtual, novaSenha } = req.body;

    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({
        error: "Parâmetros obrigatórios: senhaAtual e novaSenha."
      });
    }

    const usuarioExistente = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!usuarioExistente) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const senhaAtualCorreta = await bcrypt.compare(senhaAtual, usuarioExistente.senha);

    if (!senhaAtualCorreta) {
      return res.status(400).json({ error: "Senha atual incorreta." });
    }

    const salt = await bcrypt.genSalt(10);
    const novaSenhaHash = await bcrypt.hash(novaSenha, salt);

    await prisma.user.update({
      where: { id: userId },
      data: { senha: novaSenhaHash },
    });

    return res.json({ message: "Senha alterada com sucesso!" });

  } catch (error) {
    console.error("ERRO NO CHANGE PASSWORD:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

function gerarSenhaAleatoria(tamanho) {
  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let senha = "";
  for (let i = 0; i < tamanho; i++) {
    const indice = Math.floor(Math.random() * caracteres.length);
    senha += caracteres[indice];
  }
  return senha;
}

testEmailConnection();

process.on("beforeExit", async () => {
  await prisma.$disconnect();
});