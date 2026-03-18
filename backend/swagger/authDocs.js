/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Registrar novo usuário
 *     description: Cria uma nova conta de usuário no sistema
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Usuário criado com sucesso
 *                 user:
 *                   $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email já cadastrado
 *
 * /api/login:
 *   post:
 *     summary: Fazer login
 *     description: Autentica um usuário e retorna um token JWT
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login bem sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login realizado com sucesso
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticação
 *                 user:
 *                   $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /api/forgot-password:
 *   post:
 *     summary: Solicitar recuperação de senha
 *     description: Envia um código de recuperação para o email do usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@email.com
 *     responses:
 *       200:
 *         description: Código enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Código enviado para seu e-mail com sucesso!
 *       404:
 *         description: Email não encontrado
 *
 * /api/reset-password:
 *   post:
 *     summary: Redefinir senha
 *     description: Redefine a senha usando o código de recuperação
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - codigo
 *               - novaSenha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               codigo:
 *                 type: string
 *                 description: Código de 6 dígitos recebido por email
 *               novaSenha:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *       400:
 *         description: Código inválido ou expirado
 *
 * /api/reset-password-logged:
 *   put:
 *     summary: Alterar senha (usuário logado)
 *     description: Permite que o usuário logado altere sua própria senha
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senhaAtual
 *               - novaSenha
 *             properties:
 *               senhaAtual:
 *                 type: string
 *                 format: password
 *               novaSenha:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       401:
 *         description: Não autorizado ou senha atual incorreta
 */
