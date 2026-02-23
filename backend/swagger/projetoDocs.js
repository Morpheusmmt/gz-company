/**
 * @swagger
 * /api/projetos:
 *   get:
 *     summary: Listar projetos
 *     description: Retorna lista de projetos com paginação
 *     tags: [Projetos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ATIVO, PAUSADO, CONCLUIDO, CANCELADO]
 *     responses:
 *       200:
 *         description: Lista de projetos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Projeto'
 *       401:
 *         description: Não autorizado
 *
 *   post:
 *     summary: Criar projeto
 *     description: Cria um novo projeto vinculado a uma consultoria
 *     tags: [Projetos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descricao
 *               - consultoriaId
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               consultoriaId:
 *                 type: integer
 *               arquivos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Projeto criado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *
 * /api/projetos/estatisticas:
 *   get:
 *     summary: Estatísticas de projetos
 *     description: Retorna estatísticas gerais dos projetos
 *     tags: [Projetos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 ativos:
 *                   type: integer
 *                 concluidos:
 *                   type: integer
 *                 pausados:
 *                   type: integer
 *       401:
 *         description: Não autorizado
 *
 * /api/projetos/{id}:
 *   get:
 *     summary: Buscar projeto por ID
 *     description: Retorna detalhes de um projeto específico
 *     tags: [Projetos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do projeto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Projeto'
 *       404:
 *         description: Projeto não encontrado
 *
 *   put:
 *     summary: Atualizar projeto
 *     description: Atualiza dados de um projeto
 *     tags: [Projetos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [ATIVO, PAUSADO, CONCLUIDO, CANCELADO]
 *     responses:
 *       200:
 *         description: Projeto atualizado
 *       404:
 *         description: Projeto não encontrado
 *
 *   delete:
 *     summary: Excluir projeto
 *     description: Remove um projeto do sistema
 *     tags: [Projetos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Projeto excluído
 *       404:
 *         description: Projeto não encontrado
 *
 * /api/projetos/{id}/aprovar:
 *   patch:
 *     summary: Aprovar projeto
 *     description: Aprova um projeto pendente
 *     tags: [Projetos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Projeto aprovado
 *       404:
 *         description: Projeto não encontrado
 *
 * /api/projetos/{id}/arquivos:
 *   get:
 *     summary: Listar arquivos do projeto
 *     description: Retorna lista de arquivos anexados ao projeto
 *     tags: [Projetos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de arquivos
 *       404:
 *         description: Projeto não encontrado
 *
 *   post:
 *     summary: Upload de arquivo
 *     description: Faz upload de um arquivo para o projeto
 *     tags: [Projetos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               arquivo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Arquivo enviado
 *       400:
 *         description: Erro no upload
 *
 * /api/projetos/{id}/arquivos/{arquivoId}:
 *   get:
 *     summary: Download de arquivo
 *     description: Faz download de um arquivo do projeto
 *     tags: [Projetos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: arquivoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Arquivo para download
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Arquivo não encontrado
 *
 *   delete:
 *     summary: Excluir arquivo
 *     description: Remove um arquivo do projeto
 *     tags: [Projetos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: arquivoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Arquivo excluído
 *       404:
 *         description: Arquivo não encontrado
 */
