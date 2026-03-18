const nodemailer = require('nodemailer');

// Configuração do transporter baseado no provedor de email
const getEmailTransporter = () => {
  const emailService = process.env.EMAIL_SERVICE || "gmail";
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;

  if (!emailUser || !emailPassword) {
    throw new Error("EMAIL_USER e EMAIL_PASSWORD não configurados no .env");
  }

  // Configurações para diferentes provedores
  const config = {
    gmail: {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPassword.trim()
      }
    },
    outlook: {
      host: "smtp-mail.outlook.com",
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPassword.trim()
      }
    },
    office365: {
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPassword.trim()
      }
    },
    yahoo: {
      host: "smtp.mail.yahoo.com",
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPassword.trim()
      }
    }
  };

  return nodemailer.createTransport(config[emailService] || config.gmail);
};

const templateEmailCliente = (consultoria) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .info-box {
          background: white;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #667eea;
          border-radius: 5px;
        }
        .info-row {
          margin: 10px 0;
        }
        .label {
          font-weight: bold;
          color: #667eea;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #666;
          font-size: 12px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: #667eea;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Solicitação Recebida!</h1>
      </div>
      <div class="content">
        <p>Olá <strong>${consultoria.nome}</strong>,</p>
        
        <p>Recebemos sua solicitação de consultoria com sucesso! Nossa equipe irá analisar suas necessidades e entraremos em contato em breve.</p>
        
        <div class="info-box">
          <h3>Detalhes da Solicitação</h3>
          <div class="info-row">
            <span class="label">Protocolo:</span> ${consultoria.id}
          </div>
          <div class="info-row">
            <span class="label">Nome:</span> ${consultoria.nome}
          </div>
          <div class="info-row">
            <span class="label">Email:</span> ${consultoria.email}
          </div>
          <div class="info-row">
            <span class="label">Telefone:</span> ${consultoria.telefone}
          </div>
          <div class="info-row">
            <span class="label">Empresa:</span> ${consultoria.empresa}
          </div>
          <div class="info-row">
            <span class="label">Status:</span> ${consultoria.status}
          </div>
          <div class="info-row">
            <span class="label">Data:</span> ${new Date(consultoria.criadoEm).toLocaleString('pt-BR')}
          </div>
        </div>
        
        <div class="info-box">
          <h3> Sua Mensagem</h3>
          <p>${consultoria.descricao}</p>
        </div>
        
        <p><strong>O que acontece agora?</strong></p>
        <ul>
          <li>Nossa equipe irá analisar sua solicitação</li>
          <li>Entraremos em contato em até 48 horas úteis</li>
          <li>Você receberá atualizações por e-mail</li>
        </ul>
        
        <center>
          <a href="${process.env.FRONTEND_URL}" class="button">Acessar Portal</a>
        </center>
        
        <div class="footer">
          <p>Este é um e-mail automático, por favor não responda.</p>
          <p>Se tiver dúvidas, entre em contato através do nosso site.</p>
          <p>&copy; 2024 - Todos os direitos reservados</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Template de e-mail para a equipe interna
const templateEmailEquipe = (consultoria) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: #ff6b6b;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .alert-box {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          border-radius: 5px;
        }
        .info-box {
          background: white;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #ff6b6b;
          border-radius: 5px;
        }
        .info-row {
          margin: 10px 0;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .label {
          font-weight: bold;
          color: #ff6b6b;
          display: inline-block;
          width: 120px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: #ff6b6b;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Nova Solicitação de Consultoria</h1>
      </div>
      <div class="content">
        <div class="alert-box">
          <strong>Ação Necessária:</strong> Uma nova solicitação de consultoria precisa ser analisada.
        </div>
        
        <div class="info-box">
          <h3>Informações do Cliente</h3>
          <div class="info-row">
            <span class="label">Nome:</span> ${consultoria.nome}
          </div>
          <div class="info-row">
            <span class="label">Email:</span> <a href="mailto:${consultoria.email}">${consultoria.email}</a>
          </div>
          <div class="info-row">
            <span class="label">Telefone:</span> <a href="tel:${consultoria.telefone}">${consultoria.telefone}</a>
          </div>
          <div class="info-row">
            <span class="label">Empresa:</span> ${consultoria.empresa}
          </div>
        </div>
        
        <div class="info-box">
          <h3>Detalhes da Solicitação</h3>
          <div class="info-row">
            <span class="label">Protocolo:</span> ${consultoria.id}
          </div>
          <div class="info-row">
            <span class="label">Status:</span> ${consultoria.status}
          </div>
          <div class="info-row">
            <span class="label">Data:</span> ${new Date(consultoria.criadoEm).toLocaleString('pt-BR')}
          </div>
        </div>
        
        <div class="info-box">
          <h3>Descrição do Cliente</h3>
          <p style="background: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${consultoria.descricao}</p>
        </div>
        
        ${consultoria.arquivosAnexados && consultoria.arquivosAnexados.length > 0 ? `
        <div class="info-box">
          <h3>📎 Arquivos Anexados (${consultoria.arquivosAnexados.length})</h3>
          <ul style="list-style: none; padding: 0;">
            ${consultoria.arquivosAnexados.map(a => `
              <li style="padding: 8px 0; border-bottom: 1px solid #eee;">
                <strong>${a.nome}</strong> 
                <span style="color: #666; font-size: 12px;">(${(a.tamanho / 1024).toFixed(2)} KB)</span>
              </li>
            `).join('')}
          </ul>
          <p style="font-size: 12px; color: #888; margin-top: 10px;">Os arquivos estão anexados a este email.</p>
        </div>
        ` : ''}
        
        <center>
          <a href="${process.env.FRONTEND_URL}/admin/consultorias/${consultoria.id}" class="button">Visualizar no Sistema</a>
        </center>
        
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          <strong>Próximos Passos:</strong>
        </p>
        <ul style="color: #666;">
          <li>Acesse o sistema para mais detalhes</li>
          <li>Atribua um responsável pela consultoria</li>
          <li>Entre em contato com o cliente em até 48h</li>
        </ul>
      </div>
    </body>
    </html>
  `;
};

// e-mail de confirmação para o cliente
const enviarEmailCliente = async (consultoria) => {
  try {
    const transporter = getEmailTransporter();
    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'Equipe de Consultoria'}" <${process.env.EMAIL_USER}>`,
      to: consultoria.email,
      subject: 'Solicitação de Consultoria Recebida',
      html: templateEmailCliente(consultoria),
    });
    console.log(`E-mail enviado para o cliente: ${consultoria.email}`);
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar e-mail para cliente:', error);
    return { success: false, error: error.message };
  }
};

const enviarEmailEquipe = async (consultoria) => {
  try {
    if (!process.env.EMAIL_ADMIN) {
      console.warn("⚠️ EMAIL_ADMIN não configurado no .env");
      return { success: false, error: "EMAIL_ADMIN não configurado" };
    }

    const transporter = getEmailTransporter();
    
    // Prepara os anexos se existirem
    const attachments = [];
    if (consultoria.arquivosAnexados && consultoria.arquivosAnexados.length > 0) {
      // Busca os arquivos do banco de dados para obter o conteúdo Base64
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      
      for (const arquivo of consultoria.arquivosAnexados) {
        const arquivoCompleto = await prisma.file.findUnique({
          where: { id: arquivo.id }
        });
        
        if (arquivoCompleto && arquivoCompleto.file) {
          attachments.push({
            filename: arquivoCompleto.nomeOriginal || 'arquivo',
            content: Buffer.from(arquivoCompleto.file, 'base64'),
            contentType: arquivoCompleto.format
          });
        }
      }
      
      await prisma.$disconnect();
    }

    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'Sistema de Consultorias'}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_ADMIN,
      subject: `Nova Consultoria - ${consultoria.nome} (${consultoria.empresa})`,
      html: templateEmailEquipe(consultoria),
      attachments: attachments
    });
    console.log(`Notificação enviada para equipe: ${process.env.EMAIL_ADMIN} (${attachments.length} anexos)`);
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar notificação para equipe:', error);
    return { success: false, error: error.message };
  }
};

const enviarNotificacoes = async (consultoria) => {
  const resultados = await Promise.allSettled([
    enviarEmailCliente(consultoria),
    enviarEmailEquipe(consultoria)
  ]);

  return {
    cliente: resultados[0].status === 'fulfilled' ? resultados[0].value : { success: false, error: resultados[0].reason },
    equipe: resultados[1].status === 'fulfilled' ? resultados[1].value : { success: false, error: resultados[1].reason }
  };
};

// ==========================================
// TEMPLATES DE NOTIFICAÇÃO DE MUDANÇA DE STATUS
// ==========================================

const STATUS_CONFIG = {
  pendente: {
    label: 'Pendente',
    cor: '#FFA500',
    mensagemCliente: 'Sua solicitação está aguardando análise.',
    mensagemEquipe: 'Nova solicitação aguardando análise.'
  },
  em_atendimento: {
    label: 'Em Atendimento',
    cor: '#3498db',
    mensagemCliente: 'Sua solicitação está sendo analisada por nossa equipe.',
    mensagemEquipe: 'Consultoria em processo de atendimento.'
  },
  confirmada: {
    label: 'Confirmada',
    cor: '#27ae60',
    mensagemCliente: 'Sua consultoria foi confirmada! Em breve entraremos em contato.',
    mensagemEquipe: 'Consultoria confirmada com o cliente.'
  },
  concluida: {
    label: 'Concluída',
    cor: '#2ecc71',
    mensagemCliente: 'Sua consultoria foi concluída. Agradecemos a confiança!',
    mensagemEquipe: 'Consultoria finalizada com sucesso.'
  },
  cancelada: {
    label: 'Cancelada',
    cor: '#e74c3c',
    mensagemCliente: 'Sua solicitação foi cancelada. Entre em contato para mais informações.',
    mensagemEquipe: 'Consultoria cancelada.'
  }
};

// Template de email para notificação de mudança de status - Cliente
const templateMudancaStatusCliente = (consultoria, statusAnterior, statusNovo) => {
  const config = STATUS_CONFIG[statusNovo] || STATUS_CONFIG.pendente;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
          background-color: #f4f4f4;
        }
        .email-container {
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #D4A574 0%, #B8956A 100%); 
          color: white; 
          padding: 30px; 
          text-align: center; 
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .header p {
          margin: 10px 0 0 0;
          opacity: 0.9;
        }
        .content { 
          background: #ffffff; 
          padding: 30px; 
        }
        .status-badge { 
          display: inline-block; 
          padding: 12px 24px; 
          border-radius: 25px; 
          color: white; 
          font-weight: bold; 
          font-size: 16px;
          background: ${config.cor}; 
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .status-container {
          text-align: center;
          margin: 30px 0;
          padding: 20px;
          background: #f9f9f9;
          border-radius: 10px;
        }
        .info-box { 
          background: #f8f9fa; 
          padding: 20px; 
          margin: 20px 0; 
          border-left: 4px solid #D4A574; 
          border-radius: 0 8px 8px 0; 
        }
        .info-box h3 {
          margin-top: 0;
          color: #B8956A;
        }
        .info-row {
          display: flex;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .info-label {
          font-weight: bold;
          color: #555;
          width: 140px;
        }
        .info-value {
          color: #333;
        }
        .message-box {
          background: linear-gradient(135deg, ${config.cor}22 0%, ${config.cor}11 100%);
          border: 1px solid ${config.cor}44;
          padding: 20px;
          border-radius: 10px;
          margin: 20px 0;
          text-align: center;
        }
        .message-box p {
          margin: 0;
          font-size: 16px;
          color: #333;
        }
        .footer { 
          text-align: center; 
          padding: 20px;
          background: #f8f9fa;
          color: #666; 
          font-size: 12px; 
        }
        .button {
          display: inline-block;
          padding: 14px 30px;
          background: #D4A574;
          color: white !important;
          text-decoration: none;
          border-radius: 25px;
          font-weight: bold;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>📋 Atualização da Sua Consultoria</h1>
          <p>O status da sua solicitação foi atualizado</p>
        </div>
        <div class="content">
          <p>Olá <strong>${consultoria.nome}</strong>,</p>
          
          <p>Gostaríamos de informar que o status da sua solicitação de consultoria foi atualizado:</p>
          
          <div class="status-container">
            <p style="margin: 0 0 15px 0; color: #666;">Novo Status:</p>
            <span class="status-badge">${config.label}</span>
          </div>
          
          <div class="message-box">
            <p>${config.mensagemCliente}</p>
          </div>
          
          <div class="info-box">
            <h3>📄 Detalhes da Solicitação</h3>
            <div class="info-row">
              <span class="info-label">Protocolo:</span>
              <span class="info-value">${consultoria.id}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Empresa:</span>
              <span class="info-value">${consultoria.empresa}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Data da Solicitação:</span>
              <span class="info-value">${new Date(consultoria.criadoEm).toLocaleDateString('pt-BR')}</span>
            </div>
            ${consultoria.dataAtendimento ? `
            <div class="info-row">
              <span class="info-label">Data de Atendimento:</span>
              <span class="info-value">${new Date(consultoria.dataAtendimento).toLocaleDateString('pt-BR')}</span>
            </div>` : ''}
            ${consultoria.responsavel ? `
            <div class="info-row">
              <span class="info-label">Responsável:</span>
              <span class="info-value">${consultoria.responsavel.nome}</span>
            </div>` : ''}
          </div>
          
          <p>Em caso de dúvidas, entre em contato conosco respondendo este e-mail ou através do nosso portal.</p>
          
          <center>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="button">Acessar Portal</a>
          </center>
        </div>
        <div class="footer">
          <p>Este é um e-mail automático. Por favor, não responda diretamente.</p>
          <p>&copy; ${new Date().getFullYear()} - Sistema de Consultorias - Todos os direitos reservados</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Template de email para notificação de mudança de status - Equipe/Admin
const templateMudancaStatusEquipe = (consultoria, statusAnterior, statusNovo, alteradoPor) => {
  const configNovo = STATUS_CONFIG[statusNovo] || STATUS_CONFIG.pendente;
  const configAnterior = STATUS_CONFIG[statusAnterior] || STATUS_CONFIG.pendente;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px;
          background-color: #f4f4f4;
        }
        .email-container {
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          color: white; 
          padding: 30px; 
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 22px;
        }
        .header .protocol {
          background: rgba(255,255,255,0.2);
          display: inline-block;
          padding: 5px 15px;
          border-radius: 15px;
          margin-top: 10px;
          font-size: 14px;
        }
        .content { 
          background: #ffffff; 
          padding: 30px; 
        }
        .status-change { 
          display: flex;
          align-items: center; 
          justify-content: center; 
          gap: 15px; 
          margin: 25px 0;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 10px;
        }
        .status-badge { 
          display: inline-block; 
          padding: 10px 20px; 
          border-radius: 20px; 
          color: white; 
          font-weight: bold;
          font-size: 14px;
        }
        .arrow { 
          font-size: 28px; 
          color: #666; 
        }
        .info-box { 
          background: #f8f9fa; 
          padding: 20px; 
          margin: 20px 0; 
          border-left: 4px solid #667eea; 
          border-radius: 0 8px 8px 0;
        }
        .info-box h4 {
          margin: 0 0 15px 0;
          color: #667eea;
        }
        .info-row {
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .info-label {
          font-weight: bold;
          color: #555;
        }
        .altered-by {
          text-align: center;
          padding: 15px;
          background: #fff3cd;
          border-radius: 8px;
          margin: 20px 0;
        }
        .altered-by span {
          color: #856404;
        }
        .button {
          display: inline-block;
          padding: 14px 30px;
          background: #667eea;
          color: white !important;
          text-decoration: none;
          border-radius: 25px;
          font-weight: bold;
        }
        .footer {
          padding: 20px;
          background: #f8f9fa;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🔄 Mudança de Status</h1>
          <div class="protocol">Consultoria #${consultoria.id.substring(0, 8)}...</div>
        </div>
        <div class="content">
          <h3 style="text-align: center; color: #333;">Status Atualizado</h3>
          
          <div class="status-change">
            <span class="status-badge" style="background: ${configAnterior.cor};">${configAnterior.label}</span>
            <span class="arrow">➜</span>
            <span class="status-badge" style="background: ${configNovo.cor};">${configNovo.label}</span>
          </div>
          
          ${alteradoPor ? `
          <div class="altered-by">
            <span>👤 Alterado por: <strong>${alteradoPor}</strong></span>
          </div>` : ''}
          
          <div class="info-box">
            <h4>👤 Dados do Cliente</h4>
            <div class="info-row">
              <span class="info-label">Nome:</span> ${consultoria.nome}
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span> <a href="mailto:${consultoria.email}">${consultoria.email}</a>
            </div>
            <div class="info-row">
              <span class="info-label">Telefone:</span> <a href="tel:${consultoria.telefone}">${consultoria.telefone}</a>
            </div>
            <div class="info-row">
              <span class="info-label">Empresa:</span> ${consultoria.empresa}
            </div>
          </div>
          
          <div class="info-box">
            <h4>📋 Detalhes da Consultoria</h4>
            <div class="info-row">
              <span class="info-label">Protocolo:</span> ${consultoria.id}
            </div>
            <div class="info-row">
              <span class="info-label">Criado em:</span> ${new Date(consultoria.criadoEm).toLocaleString('pt-BR')}
            </div>
            <div class="info-row">
              <span class="info-label">Atualizado em:</span> ${new Date().toLocaleString('pt-BR')}
            </div>
            <div class="info-row">
              <span class="info-label">Responsável:</span> ${consultoria.responsavel ? `${consultoria.responsavel.nome} (${consultoria.responsavel.email})` : 'Não atribuído'}
            </div>
          </div>
          
          <p style="color: #666; font-size: 14px; text-align: center; margin: 20px 0;">
            ${configNovo.mensagemEquipe}
          </p>
          
          <center>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/menu/consultorias" class="button">Ver no Sistema</a>
          </center>
        </div>
        <div class="footer">
          <p>Notificação automática do Sistema de Consultorias</p>
          <p>&copy; ${new Date().getFullYear()} - Todos os direitos reservados</p>
        </div>
      </div>
    </body>
    </html>
  `;
};


const enviarNotificacaoMudancaStatus = async (consultoria, statusAnterior, statusNovo, alteradoPor = null) => {
  const resultados = {
    cliente: { success: false, error: null },
    equipe: { success: false, error: null }
  };

  // Não envia notificação se o status não mudou
  if (statusAnterior === statusNovo) {
    console.log('Status não mudou, notificação não enviada.');
    return resultados;
  }

  try {
    const transporter = getEmailTransporter();

    try {
      await transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || 'Sistema de Consultorias'}" <${process.env.EMAIL_USER}>`,
        to: consultoria.email,
        subject: `Atualização da sua Consultoria - ${STATUS_CONFIG[statusNovo]?.label || statusNovo}`,
        html: templateMudancaStatusCliente(consultoria, statusAnterior, statusNovo),
      });
      console.log(`✅ Notificação de status enviada para cliente: ${consultoria.email}`);
      resultados.cliente = { success: true };
    } catch (error) {
      console.error('❌ Erro ao enviar notificação para cliente:', error.message);
      resultados.cliente = { success: false, error: error.message };
    }

    if (process.env.EMAIL_ADMIN) {
      try {
        await transporter.sendMail({
          from: `"${process.env.EMAIL_FROM_NAME || 'Sistema de Consultorias'}" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_ADMIN,
          subject: `[Status Alterado] Consultoria ${consultoria.empresa} - ${STATUS_CONFIG[statusNovo]?.label || statusNovo}`,
          html: templateMudancaStatusEquipe(consultoria, statusAnterior, statusNovo, alteradoPor),
        });
        console.log(`✅ Notificação de status enviada para equipe: ${process.env.EMAIL_ADMIN}`);
        resultados.equipe = { success: true };
      } catch (error) {
        console.error('❌ Erro ao enviar notificação para equipe:', error.message);
        resultados.equipe = { success: false, error: error.message };
      }
    } else {
      console.warn('⚠️ EMAIL_ADMIN não configurado - notificação para equipe não enviada');
      resultados.equipe = { success: false, error: 'EMAIL_ADMIN não configurado' };
    }

  } catch (error) {
    console.error('❌ Erro geral ao enviar notificações:', error.message);
  }

  return resultados;
};

module.exports = {
  enviarEmailCliente,
  enviarEmailEquipe,
  enviarNotificacoes,
  enviarNotificacaoMudancaStatus,
  STATUS_CONFIG
};