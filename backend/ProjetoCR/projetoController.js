const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');

// Criar novo projeto
const criarProjeto = async (req, res, next) => {
  try {
    const { titulo, descricao, dataInicio, dataFim, etapa, responsavelId } = req.body;
    const userId = req.user.id;

    const projeto = await prisma.projeto.create({
      data: {
        titulo,
        descricao,
        dataInicio: dataInicio ? new Date(dataInicio) : null,
        dataFim: dataFim ? new Date(dataFim) : null,
        etapa: etapa || 'planejamento',
        status: 'em_andamento',
        aprovado: false,
        criadorId: userId,
        responsavelId: responsavelId || userId
      },
      include: {
        criador: {
          select: { id: true, nome: true, email: true }
        },
        responsavel: {
          select: { id: true, nome: true, email: true }
        },
        arquivos: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Projeto criado com sucesso!',
      data: projeto
    });
  } catch (error) {
    next(error);
  }
};

// Listar projetos 
const listarProjetos = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, etapa, search, aprovado } = req.query;
    const userId = req.user.id;
    const userRoles = req.user.roles || [];
    const isAdmin = userRoles.some(role => role.id === 1 || role === 1);

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where = {};

    // Se não for admin, mostrar apenas projetos do usuário
    if (!isAdmin) {
      where.OR = [
        { criadorId: userId },
        { responsavelId: userId },
        { participantes: { some: { usuarioId: userId } } }
      ];
    }

    if (status) where.status = status;
    if (etapa) where.etapa = etapa;
    if (aprovado !== undefined) where.aprovado = aprovado === 'true';
    
    if (search) {
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { titulo: { contains: search, mode: 'insensitive' } },
            { descricao: { contains: search, mode: 'insensitive' } },
            { criador: { nome: { contains: search, mode: 'insensitive' } } },
            { responsavel: { nome: { contains: search, mode: 'insensitive' } } }
          ]
        }
      ];
    }

    const [projetos, total] = await Promise.all([
      prisma.projeto.findMany({
        where,
        skip,
        take,
        orderBy: { criadoEm: 'desc' },
        include: {
          criador: {
            select: { id: true, nome: true, email: true }
          },
          responsavel: {
            select: { id: true, nome: true, email: true }
          },
          arquivos: {
            select: {
              id: true,
              file: true,
              nomeOriginal: true,
              format: true,
              tamanho: true,
              descricao: true,
              criadoEm: true
            }
          },
          participantes: {
            include: {
              usuario: {
                select: { id: true, nome: true, email: true }
              }
            }
          }
        }
      }),
      prisma.projeto.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: projetos,
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

// Buscar projeto por ID
const buscarProjeto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRoles = req.user.roles || [];
    const isAdmin = userRoles.some(role => role.id === 1 || role === 1);

    const projeto = await prisma.projeto.findUnique({
      where: { id },
      include: {
        criador: {
          select: { id: true, nome: true, email: true }
        },
        responsavel: {
          select: { id: true, nome: true, email: true }
        },
        arquivos: {
          include: {
            user: {
              select: { id: true, nome: true }
            }
          }
        },
        participantes: {
          include: {
            usuario: {
              select: { id: true, nome: true, email: true }
            }
          }
        }
      }
    });

    if (!projeto) {
      return res.status(404).json({
        success: false,
        message: 'Projeto não encontrado'
      });
    }

    // Verificar permissão
    const isParticipante = projeto.participantes.some(p => p.usuarioId === userId);
    if (!isAdmin && projeto.criadorId !== userId && projeto.responsavelId !== userId && !isParticipante) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para visualizar este projeto'
      });
    }

    res.status(200).json({
      success: true,
      data: projeto
    });
  } catch (error) {
    next(error);
  }
};

// Atualizar projeto
const atualizarProjeto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, status, dataInicio, dataFim, etapa, resultados, responsavelId } = req.body;
    const userId = req.user.id;
    const userRoles = req.user.roles || [];
    const isAdmin = userRoles.some(role => role.id === 1 || role === 1);

    const projetoExistente = await prisma.projeto.findUnique({
      where: { id },
      include: { participantes: true }
    });

    if (!projetoExistente) {
      return res.status(404).json({
        success: false,
        message: 'Projeto não encontrado'
      });
    }

    // Verificar permissão
    const isParticipante = projetoExistente.participantes.some(p => p.usuarioId === userId);
    if (!isAdmin && projetoExistente.criadorId !== userId && projetoExistente.responsavelId !== userId && !isParticipante) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para editar este projeto'
      });
    }

    const dataAtualizar = {};
    if (titulo) dataAtualizar.titulo = titulo;
    if (descricao) dataAtualizar.descricao = descricao;
    if (status) dataAtualizar.status = status;
    if (dataInicio !== undefined) dataAtualizar.dataInicio = dataInicio ? new Date(dataInicio) : null;
    if (dataFim !== undefined) dataAtualizar.dataFim = dataFim ? new Date(dataFim) : null;
    if (etapa) dataAtualizar.etapa = etapa;
    if (resultados !== undefined) dataAtualizar.resultados = resultados;
    if (responsavelId !== undefined) dataAtualizar.responsavelId = responsavelId;

    const projeto = await prisma.projeto.update({
      where: { id },
      data: dataAtualizar,
      include: {
        criador: { select: { id: true, nome: true, email: true } },
        responsavel: { select: { id: true, nome: true, email: true } },
        arquivos: true,
        participantes: {
          include: {
            usuario: { select: { id: true, nome: true, email: true } }
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Projeto atualizado com sucesso',
      data: projeto
    });
  } catch (error) {
    next(error);
  }
};

// Aprovar/Reprovar projeto 
const aprovarProjeto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { aprovado } = req.body;
    const userRoles = req.user.roles || [];
    const isAdmin = userRoles.some(role => role.id === 1 || role === 1);

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Apenas administradores podem aprovar/reprovar projetos'
      });
    }

    const projetoExistente = await prisma.projeto.findUnique({ where: { id } });
    if (!projetoExistente) {
      return res.status(404).json({
        success: false,
        message: 'Projeto não encontrado'
      });
    }

    const projeto = await prisma.projeto.update({
      where: { id },
      data: { aprovado: Boolean(aprovado) },
      include: {
        criador: { select: { id: true, nome: true, email: true } },
        responsavel: { select: { id: true, nome: true, email: true } }
      }
    });

    res.status(200).json({
      success: true,
      message: aprovado ? 'Projeto aprovado com sucesso' : 'Projeto reprovado',
      data: projeto
    });
  } catch (error) {
    next(error);
  }
};

// Excluir projeto
const excluirProjeto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRoles = req.user.roles || [];
    const isAdmin = userRoles.some(role => role.id === 1 || role === 1);

    const projetoExistente = await prisma.projeto.findUnique({
      where: { id },
      include: { arquivos: true }
    });

    if (!projetoExistente) {
      return res.status(404).json({
        success: false,
        message: 'Projeto não encontrado'
      });
    }

    // Apenas admin ou criador pode excluir
    if (!isAdmin && projetoExistente.criadorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Apenas o criador do projeto ou administradores podem excluí-lo'
      });
    }

    // Deletar arquivos físicos
    for (const arquivo of projetoExistente.arquivos) {
      const filePath = path.join(__dirname, '..', 'uploads', arquivo.file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await prisma.projeto.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Projeto excluído com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

// Upload de arquivo para projeto
const uploadArquivo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { descricao } = req.body;
    const userId = req.user.id;
    const userRoles = req.user.roles || [];
    const isAdmin = userRoles.some(role => role.id === 1 || role === 1);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo enviado'
      });
    }

    const projetoExistente = await prisma.projeto.findUnique({
      where: { id },
      include: { participantes: true }
    });

    if (!projetoExistente) {
      return res.status(404).json({
        success: false,
        message: 'Projeto não encontrado'
      });
    }

    // Verificar permissão
    const isParticipante = projetoExistente.participantes.some(p => p.usuarioId === userId);
    if (!isAdmin && projetoExistente.criadorId !== userId && projetoExistente.responsavelId !== userId && !isParticipante) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para enviar arquivos neste projeto'
      });
    }

    const arquivo = await prisma.file.create({
      data: {
        file: req.file.filename,
        nomeOriginal: req.file.originalname,
        format: req.file.mimetype,
        tamanho: req.file.size,
        descricao: descricao || null,
        userId: userId,
        projetoId: id
      }
    });

    res.status(201).json({
      success: true,
      message: 'Arquivo enviado com sucesso',
      data: arquivo
    });
  } catch (error) {
    next(error);
  }
};

// Listar arquivos do projeto
const listarArquivos = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRoles = req.user.roles || [];
    const isAdmin = userRoles.some(role => role.id === 1 || role === 1);

    const projeto = await prisma.projeto.findUnique({
      where: { id },
      include: { participantes: true }
    });

    if (!projeto) {
      return res.status(404).json({
        success: false,
        message: 'Projeto não encontrado'
      });
    }

    // Verificar permissão
    const isParticipante = projeto.participantes.some(p => p.usuarioId === userId);
    if (!isAdmin && projeto.criadorId !== userId && projeto.responsavelId !== userId && !isParticipante) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para visualizar os arquivos deste projeto'
      });
    }

    const arquivos = await prisma.file.findMany({
      where: { projetoId: id },
      include: {
        user: {
          select: { id: true, nome: true }
        }
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

// Download de arquivo
const downloadArquivo = async (req, res, next) => {
  try {
    const { id, arquivoId } = req.params;
    const userId = req.user.id;
    const userRoles = req.user.roles || [];
    const isAdmin = userRoles.some(role => role.id === 1 || role === 1);

    const projeto = await prisma.projeto.findUnique({
      where: { id },
      include: { participantes: true }
    });

    if (!projeto) {
      return res.status(404).json({
        success: false,
        message: 'Projeto não encontrado'
      });
    }

    // Verificar permissão
    const isParticipante = projeto.participantes.some(p => p.usuarioId === userId);
    if (!isAdmin && projeto.criadorId !== userId && projeto.responsavelId !== userId && !isParticipante) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para baixar arquivos deste projeto'
      });
    }

    const arquivo = await prisma.file.findFirst({
      where: { id: arquivoId, projetoId: id }
    });

    if (!arquivo) {
      return res.status(404).json({
        success: false,
        message: 'Arquivo não encontrado'
      });
    }

    // O arquivo está armazenado como Base64 no banco de dados
    // Converte de volta para buffer binário
    const fileBuffer = Buffer.from(arquivo.file, 'base64');
    
    // Define os headers para download
    const fileName = arquivo.nomeOriginal || 'arquivo';
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
    res.setHeader('Content-Type', arquivo.format || 'application/octet-stream');
    res.setHeader('Content-Length', fileBuffer.length);
    
    // Envia o arquivo
    res.send(fileBuffer);
  } catch (error) {
    next(error);
  }
};

// Excluir arquivo
const excluirArquivo = async (req, res, next) => {
  try {
    const { id, arquivoId } = req.params;
    const userId = req.user.id;
    const userRoles = req.user.roles || [];
    const isAdmin = userRoles.some(role => role.id === 1 || role === 1);

    const arquivo = await prisma.file.findFirst({
      where: { id: arquivoId, projetoId: id }
    });

    if (!arquivo) {
      return res.status(404).json({
        success: false,
        message: 'Arquivo não encontrado'
      });
    }

    // Apenas admin ou quem fez upload pode excluir
    if (!isAdmin && arquivo.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para excluir este arquivo'
      });
    }

    // Deleta o registro do banco (arquivo está armazenado como Base64 no próprio registro)
    await prisma.file.delete({ where: { id: arquivoId } });

    res.status(200).json({
      success: true,
      message: 'Arquivo excluído com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

// Atualizar descrição do arquivo
const atualizarArquivo = async (req, res, next) => {
  try {
    const { id, arquivoId } = req.params;
    const { descricao } = req.body;
    const userId = req.user.id;
    const userRoles = req.user.roles || [];
    const isAdmin = userRoles.some(role => role.id === 1 || role === 1);

    const arquivo = await prisma.file.findFirst({
      where: { id: arquivoId, projetoId: id }
    });

    if (!arquivo) {
      return res.status(404).json({
        success: false,
        message: 'Arquivo não encontrado'
      });
    }

    // Apenas admin ou quem fez upload pode editar
    if (!isAdmin && arquivo.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para editar este arquivo'
      });
    }

    const arquivoAtualizado = await prisma.file.update({
      where: { id: arquivoId },
      data: { descricao }
    });

    res.status(200).json({
      success: true,
      message: 'Arquivo atualizado com sucesso',
      data: arquivoAtualizado
    });
  } catch (error) {
    next(error);
  }
};

// Estatísticas dos projetos 
const estatisticasProjetos = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRoles = req.user.roles || [];
    const isAdmin = userRoles.some(role => role.id === 1 || role === 1);

    const whereBase = isAdmin ? {} : {
      OR: [
        { criadorId: userId },
        { responsavelId: userId },
        { participantes: { some: { usuarioId: userId } } }
      ]
    };

    const [
      total,
      emAndamento,
      concluidos,
      aprovados,
      pendentesAprovacao,
      porEtapa
    ] = await Promise.all([
      prisma.projeto.count({ where: whereBase }),
      prisma.projeto.count({ where: { ...whereBase, status: 'em_andamento' } }),
      prisma.projeto.count({ where: { ...whereBase, status: 'concluido' } }),
      prisma.projeto.count({ where: { ...whereBase, aprovado: true } }),
      prisma.projeto.count({ where: { ...whereBase, aprovado: false } }),
      prisma.projeto.groupBy({
        by: ['etapa'],
        where: whereBase,
        _count: { etapa: true }
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        emAndamento,
        concluidos,
        aprovados,
        pendentesAprovacao,
        porEtapa: porEtapa.reduce((acc, item) => {
          acc[item.etapa] = item._count.etapa;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  criarProjeto,
  listarProjetos,
  buscarProjeto,
  atualizarProjeto,
  aprovarProjeto,
  excluirProjeto,
  uploadArquivo,
  listarArquivos,
  downloadArquivo,
  excluirArquivo,
  atualizarArquivo,
  estatisticasProjetos
};
