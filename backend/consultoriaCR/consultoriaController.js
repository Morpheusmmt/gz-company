const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { enviarNotificacoes, enviarNotificacaoMudancaStatus } = require('./emailService');

const criarConsultoria = async (req, res, next) => {
  try {
    const { nome, email, telefone, empresa, descricao, consentimento } = req.body;

    const ultimaSolicitacao = await prisma.consultoria.findFirst({
      where: {
        email: email.toLowerCase(),
        criadoEm: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) 
        }
      }
    });

    if (ultimaSolicitacao) {
      return res.status(429).json({
        success: false,
        message: 'Você já enviou uma solicitação recentemente. Aguarde 24 horas para enviar outra.'
      });
    }

    const consultoria = await prisma.consultoria.create({
      data: {
        nome,
        email: email.toLowerCase(),
        telefone,
        empresa,
        descricao,
        consentimento: consentimento === 'true' || consentimento === true,
        status: 'pendente'
      }
    });

    // Salvar arquivos anexados (se houver)
    const arquivosSalvos = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const base64 = file.buffer.toString('base64');
        const arquivoSalvo = await prisma.file.create({
          data: {
            file: base64,
            nomeOriginal: file.originalname,
            format: file.mimetype,
            tamanho: file.size,
            tipo: 'consultoria',
            consultoriaId: consultoria.id,
            userId: req.user.id // Usuário logado que enviou a consultoria
          }
        });
        arquivosSalvos.push({
          id: arquivoSalvo.id,
          nome: arquivoSalvo.nomeOriginal,
          tamanho: arquivoSalvo.tamanho,
          formato: arquivoSalvo.format
        });
      }
    }

    // Adiciona info dos arquivos na consultoria para o email
    consultoria.arquivosAnexados = arquivosSalvos;

    const resultadoEmails = await enviarNotificacoes(consultoria);
    
    if (!resultadoEmails.cliente.success) {
      console.warn('Falha ao enviar e-mail para cliente:', resultadoEmails.cliente.error);
    }
    if (!resultadoEmails.equipe.success) {
      console.warn('Falha ao enviar notificação para equipe:', resultadoEmails.equipe.error);
    }

    res.status(201).json({
      success: true,
      message: 'Solicitação de consultoria enviada com sucesso!',
      data: {
        id: consultoria.id,
        nome: consultoria.nome,
        email: consultoria.email,
        status: consultoria.status,
        criadoEm: consultoria.criadoEm,
        arquivos: arquivosSalvos
      }
    });
  } catch (error) {
    next(error);
  }
};

const listarConsultorias = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, email, empresa, responsavelId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where = {};
    if (status) where.status = status;
    if (email) where.email = { contains: email, mode: 'insensitive' };
    if (empresa) where.empresa = { contains: empresa, mode: 'insensitive' };
    if (responsavelId) where.responsavelId = responsavelId;

    const [consultorias, total] = await Promise.all([
      prisma.consultoria.findMany({
        where,
        skip,
        take,
        orderBy: { criadoEm: 'desc' },
        include: {
          responsavel: {
            select: {
              id: true,
              nome: true,
              email: true
            }
          }
        }
      }),
      prisma.consultoria.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: consultorias,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

const buscarConsultoria = async (req, res, next) => {
  try {
    const { id } = req.params;

    const consultoria = await prisma.consultoria.findUnique({
      where: { id },
      include: {
        responsavel: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });

    if (!consultoria) {
      return res.status(404).json({
        success: false,
        message: 'Consultoria não encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: consultoria
    });
  } catch (error) {
    next(error);
  }
};

const atualizarStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const statusValidos = ['pendente', 'em_atendimento', 'confirmada', 'concluida', 'cancelada'];
    if (!statusValidos.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status inválido. Use um dos seguintes: ${statusValidos.join(', ')}`
      });
    }

    // Verifica se existe
    const consultoriaExistente = await prisma.consultoria.findUnique({
      where: { id }
    });

    if (!consultoriaExistente) {
      return res.status(404).json({
        success: false,
        message: 'Consultoria não encontrada'
      });
    }

    // Guarda o status anterior para comparação
    const statusAnterior = consultoriaExistente.status;

    const consultoria = await prisma.consultoria.update({
      where: { id },
      data: { status },
      include: {
        responsavel: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });

    // Envia notificação se o status mudou
    if (statusAnterior !== status) {
      const alteradoPor = req.user?.nome || req.user?.email || 'Sistema';
      const resultadoNotificacao = await enviarNotificacaoMudancaStatus(
        consultoria,
        statusAnterior,
        status,
        alteradoPor
      );
      console.log('Resultado notificação mudança de status:', resultadoNotificacao);
    }

    res.status(200).json({
      success: true,
      message: 'Status atualizado com sucesso',
      data: consultoria
    });
  } catch (error) {
    next(error);
  }
};

// Adiciona observações ou responsável
const atualizarConsultoria = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { observacoes, responsavelId, dataAtendimento, status } = req.body;

    const consultoriaExistente = await prisma.consultoria.findUnique({
      where: { id }
    });

    if (!consultoriaExistente) {
      return res.status(404).json({
        success: false,
        message: 'Consultoria não encontrada'
      });
    }

    const statusAnterior = consultoriaExistente.status;

    if (responsavelId) {
      const usuarioExistente = await prisma.user.findUnique({
        where: { id: responsavelId }
      });

      if (!usuarioExistente) {
        return res.status(404).json({
          success: false,
          message: 'Usuário responsável não encontrado'
        });
      }
    }

    const dataUpdate = {};
    if (observacoes !== undefined) dataUpdate.observacoes = observacoes;
    if (responsavelId !== undefined) dataUpdate.responsavelId = responsavelId;
    if (dataAtendimento !== undefined) dataUpdate.dataAtendimento = new Date(dataAtendimento);
    if (status !== undefined) dataUpdate.status = status;

    const consultoria = await prisma.consultoria.update({
      where: { id },
      data: dataUpdate,
      include: {
        responsavel: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });

    // Envia notificação se o status mudou
    if (status !== undefined && statusAnterior !== status) {
      const alteradoPor = req.user?.nome || req.user?.email || 'Sistema';
      const resultadoNotificacao = await enviarNotificacaoMudancaStatus(
        consultoria,
        statusAnterior,
        status,
        alteradoPor
      );
      console.log('Resultado notificação mudança de status:', resultadoNotificacao);
    }

    res.status(200).json({
      success: true,
      message: 'Consultoria atualizada com sucesso',
      data: consultoria
    });
  } catch (error) {
    next(error);
  }
};

const deletarConsultoria = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar se existe
    const consultoriaExistente = await prisma.consultoria.findUnique({
      where: { id }
    });

    if (!consultoriaExistente) {
      return res.status(404).json({
        success: false,
        message: 'Consultoria não encontrada'
      });
    }

    const consultoria = await prisma.consultoria.update({
      where: { id },
      data: { status: 'cancelada' }
    });

    res.status(200).json({
      success: true,
      message: 'Consultoria cancelada com sucesso',
      data: consultoria
    });
  } catch (error) {
    next(error);
  }
};

// Listar arquivos de uma consultoria
const listarArquivosConsultoria = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verifica se a consultoria existe
    const consultoria = await prisma.consultoria.findUnique({
      where: { id }
    });

    if (!consultoria) {
      return res.status(404).json({
        success: false,
        message: 'Consultoria não encontrada'
      });
    }

    const arquivos = await prisma.file.findMany({
      where: { consultoriaId: id },
      select: {
        id: true,
        nomeOriginal: true,
        format: true,
        tamanho: true,
        criadoEm: true
      },
      orderBy: { criadoEm: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: arquivos
    });
  } catch (error) {
    next(error);
  }
};

// Download de arquivo da consultoria
const downloadArquivoConsultoria = async (req, res, next) => {
  try {
    const { id, arquivoId } = req.params;

    // Verifica se a consultoria existe
    const consultoria = await prisma.consultoria.findUnique({
      where: { id }
    });

    if (!consultoria) {
      return res.status(404).json({
        success: false,
        message: 'Consultoria não encontrada'
      });
    }

    // Busca o arquivo
    const arquivo = await prisma.file.findFirst({
      where: {
        id: arquivoId,
        consultoriaId: id
      }
    });

    if (!arquivo) {
      return res.status(404).json({
        success: false,
        message: 'Arquivo não encontrado'
      });
    }

    // Converte Base64 para Buffer
    const fileBuffer = Buffer.from(arquivo.file, 'base64');

    // Define headers para download
    res.setHeader('Content-Disposition', `attachment; filename="${arquivo.nomeOriginal}"`);
    res.setHeader('Content-Type', arquivo.format || 'application/octet-stream');
    res.setHeader('Content-Length', fileBuffer.length);

    res.send(fileBuffer);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  criarConsultoria,
  listarConsultorias,
  buscarConsultoria,
  atualizarStatus,
  atualizarConsultoria,
  deletarConsultoria,
  listarArquivosConsultoria,
  downloadArquivoConsultoria
};