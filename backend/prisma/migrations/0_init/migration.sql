-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "alterado_em" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarioxrole" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarioxrole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recuperacao_senha" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_aleatoria" TEXT NOT NULL,
    "data_expiracao" TIMESTAMP(3) NOT NULL,
    "utilizado" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "recuperacao_senha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultorias" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "consentimento" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "alterado_em" TIMESTAMP(3) NOT NULL,
    "observacoes" TEXT,
    "data_atendimento" TIMESTAMP(3),
    "responsavel_id" TEXT,

    CONSTRAINT "consultorias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_usuario_key" ON "usuarios"("usuario");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_email_idx" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_usuario_idx" ON "usuarios"("usuario");

-- CreateIndex
CREATE INDEX "usuarios_status_idx" ON "usuarios"("status");

-- CreateIndex
CREATE UNIQUE INDEX "roles_nome_key" ON "roles"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "usuarioxrole_userId_roleId_key" ON "usuarioxrole"("userId", "roleId");

-- CreateIndex
CREATE INDEX "recuperacao_senha_email_idx" ON "recuperacao_senha"("email");

-- CreateIndex
CREATE INDEX "recuperacao_senha_senha_aleatoria_idx" ON "recuperacao_senha"("senha_aleatoria");

-- CreateIndex
CREATE INDEX "recuperacao_senha_data_expiracao_idx" ON "recuperacao_senha"("data_expiracao");

-- CreateIndex
CREATE INDEX "consultorias_email_idx" ON "consultorias"("email");

-- CreateIndex
CREATE INDEX "consultorias_status_idx" ON "consultorias"("status");

-- CreateIndex
CREATE INDEX "consultorias_criado_em_idx" ON "consultorias"("criado_em");

-- AddForeignKey
ALTER TABLE "usuarioxrole" ADD CONSTRAINT "usuarioxrole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarioxrole" ADD CONSTRAINT "usuarioxrole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recuperacao_senha" ADD CONSTRAINT "recuperacao_senha_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultorias" ADD CONSTRAINT "consultorias_responsavel_id_fkey" FOREIGN KEY ("responsavel_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

