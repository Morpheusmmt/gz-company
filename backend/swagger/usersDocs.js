/**
 * @swagger
 * /users:
 *   get:
 *     summary: Listar usuários
 *     description: Retorna lista de todos os usuários do sistema
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
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
 *                     $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Não autorizado
 *
 *   post:
 *     summary: Criar usuário
 *     description: Cria um novo usuário (admin)
 *     tags: [Usuários]
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
 *               - email
 *               - password
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               roleId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Usuário criado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *
 * /users/{id}:
 *   get:
 *     summary: Buscar usuário por ID
 *     description: Retorna dados de um usuário específico
 *     tags: [Usuários]
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
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuário não encontrado
 *       401:
 *         description: Não autorizado
 *
 *   put:
 *     summary: Atualizar usuário
 *     description: Atualiza dados de um usuário
 *     tags: [Usuários]
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
 *               email:
 *                 type: string
 *                 format: email
 *               roleId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *       404:
 *         description: Usuário não encontrado
 *       401:
 *         description: Não autorizado
 *
 *   delete:
 *     summary: Deletar usuário
 *     description: Remove um usuário do sistema
 *     tags: [Usuários]
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
 *         description: Usuário deletado
 *       404:
 *         description: Usuário não encontrado
 *       401:
 *         description: Não autorizado
 *
 * /users/roles:
 *   get:
 *     summary: Listar roles disponíveis
 *     description: Retorna lista de todas as roles do sistema
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       401:
 *         description: Não autorizado
 */
