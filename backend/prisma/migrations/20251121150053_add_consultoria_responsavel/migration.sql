/*
  Warnings:

  - You are about to drop the column `responsavel` on the `consultorias` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "consultorias" DROP COLUMN "responsavel",
ADD COLUMN     "responsavel_id" TEXT;

-- AddForeignKey
ALTER TABLE "consultorias" ADD CONSTRAINT "consultorias_responsavel_id_fkey" FOREIGN KEY ("responsavel_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
