const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

  async function uploadArquivo(req, res) {
    try {
      const { id: projetoId } = req.params;
      const { descricao } = req.body;
      const arquivo = req.file;

      if (!projetoId) {
        return res.status(400).json({
          message: 'Projeto não informado'
        });
      }

      if (!arquivo) {
        return res.status(400).json({
          message: 'Arquivo não enviado'
        });
      }

      //conversor para a base 64
      const base64 = arquivo.buffer.toString('base64');

      await prisma.file.create({
        data: {
                file: base64,
                nomeOriginal: arquivo.originalname,
                format: arquivo.mimetype,
                tamanho: arquivo.size,
                descricao: descricao || null,
                userId: req.user.id,
                projetoId: projetoId
            }
        });

      return res.status(201).json({
        message: 'Arquivo enviado com sucesso'
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Erro ao salvar arquivo'
      });
    }
  }

module.exports = { uploadArquivo };