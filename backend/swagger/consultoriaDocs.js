/**
 * @swagger
 * /api/consultorias:
 *   get:
 *     summary: Listar consultorias
 *     description: Retorna lista de consultorias com paginação e filtros
 *     tags: [Consultorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Itens por página
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDENTE, EM_ANALISE, APROVADA, REJEITADA, CONCLUIDA]
 *         description: Filtrar por status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nome ou empresa
 *     responses:
 *       200:
 *         description: Lista de consultorias
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
 *                     $ref: '#/components/schemas/Consultoria'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: Não autorizado
 *
 *   post:
 *     summary: Criar consultoria
 *     description: Cria uma nova solicitação de consultoria
 *     tags: [Consultorias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - telefone
 *               - empresa
 *               - descricao
 *               - consentimento
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               telefone:
 *                 type: string
 *               empresa:
 *                 type: string
 *               descricao:
 *                 type: string
 *               consentimento:
 *                 type: boolean
 *               arquivos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Até 5 arquivos (PDF, DOC, DOCX, JPG, PNG, GIF)
 *     responses:
 *       201:
 *         description: Consultoria criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Consultoria'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *
 * /api/consultorias/{id}:
 *   get:
 *     summary: Buscar consultoria por ID
 *     description: Retorna os detalhes de uma consultoria específica
 *     tags: [Consultorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da consultoria
 *     responses:
 *       200:
 *         description: Dados da consultoria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Consultoria'
 *       404:
 *         description: Consultoria não encontrada
 *       401:
 *         description: Não autorizado
 *
 *   patch:
 *     summary: Atualizar consultoria
 *     description: Atualiza dados de uma consultoria existente
 *     tags: [Consultorias]
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
 *               responsavelId:
 *                 type: integer
 *                 description: ID do novo responsável
 *     responses:
 *       200:
 *         description: Consultoria atualizada
 *       404:
 *         description: Consultoria não encontrada
 *       401:
 *         description: Não autorizado
 *
 *   delete:
 *     summary: Deletar consultoria
 *     description: Remove uma consultoria do sistema
 *     tags: [Consultorias]
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
 *         description: Consultoria deletada com sucesso
 *       404:
 *         description: Consultoria não encontrada
 *       401:
 *         description: Não autorizado
 *
 * /api/consultorias/{id}/status:
 *   patch:
 *     summary: Atualizar status da consultoria
 *     description: Altera o status de uma consultoria
 *     tags: [Consultorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDENTE, EM_ANALISE, APROVADA, REJEITADA, CONCLUIDA]
 *     responses:
 *       200:
 *         description: Status atualizado
 *       400:
 *         description: Status inválido
 *       404:
 *         description: Consultoria não encontrada
 *
 * /api/consultorias/{id}/arquivos:
 *   get:
 *     summary: Listar arquivos da consultoria
 *     description: Retorna lista de arquivos anexados à consultoria
 *     tags: [Consultorias]
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nome:
 *                         type: string
 *                       tipo:
 *                         type: string
 *                       tamanho:
 *                         type: integer
 *       404:
 *         description: Consultoria não encontrada
 *
 * /api/consultorias/{id}/arquivos/{arquivoId}/download:
 *   get:
 *     summary: Download de arquivo
 *     description: Faz download de um arquivo específico da consultoria
 *     tags: [Consultorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da consultoria
 *       - in: path
 *         name: arquivoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do arquivo
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
 */
