/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Listar roles
 *     description: Retorna lista de todas as roles do sistema
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de roles
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
 *                     $ref: '#/components/schemas/Role'
 *       401:
 *         description: Não autorizado
 *
 *   post:
 *     summary: Criar role
 *     description: Cria uma nova role no sistema
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Gerente
 *               permissoes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["criar_projeto", "editar_projeto", "ver_relatorios"]
 *     responses:
 *       201:
 *         description: Role criada
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *
 * /roles/{id}:
 *   get:
 *     summary: Buscar role por ID
 *     description: Retorna detalhes de uma role específica
 *     tags: [Roles]
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
 *         description: Dados da role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: Role não encontrada
 *
 *   put:
 *     summary: Atualizar role
 *     description: Atualiza dados de uma role
 *     tags: [Roles]
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
 *               nome:
 *                 type: string
 *               permissoes:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Role atualizada
 *       404:
 *         description: Role não encontrada
 *
 *   delete:
 *     summary: Deletar role
 *     description: Remove uma role do sistema
 *     tags: [Roles]
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
 *         description: Role deletada
 *       404:
 *         description: Role não encontrada
 *       400:
 *         description: Não é possível deletar role em uso
 */
