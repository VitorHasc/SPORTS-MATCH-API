/*
  Warnings:

  - Added the required column `pedido` to the `Grupo_Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Esporte_usuarioId_fkey` ON `esporte`;

-- DropIndex
DROP INDEX `Grupo_Usuario_grupoId_idx` ON `grupo_usuario`;

-- DropIndex
DROP INDEX `Grupo_Usuario_usuarioId_grupoId_key` ON `grupo_usuario`;

-- DropIndex
DROP INDEX `Grupo_Usuario_usuarioId_idx` ON `grupo_usuario`;

-- DropIndex
DROP INDEX `MensagemInd_destinatarioId_fkey` ON `mensagemind`;

-- DropIndex
DROP INDEX `MensagemInd_remetenteId_fkey` ON `mensagemind`;

-- AlterTable
ALTER TABLE `grupo_usuario` ADD COLUMN `pedido` BOOLEAN NOT NULL;

-- AddForeignKey
ALTER TABLE `Esporte` ADD CONSTRAINT `Esporte_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`idusuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MensagemInd` ADD CONSTRAINT `MensagemInd_remetenteId_fkey` FOREIGN KEY (`remetenteId`) REFERENCES `Usuario`(`idusuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MensagemInd` ADD CONSTRAINT `MensagemInd_destinatarioId_fkey` FOREIGN KEY (`destinatarioId`) REFERENCES `Usuario`(`idusuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Grupo_Usuario` ADD CONSTRAINT `Grupo_Usuario_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`idusuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Grupo_Usuario` ADD CONSTRAINT `Grupo_Usuario_grupoId_fkey` FOREIGN KEY (`grupoId`) REFERENCES `Grupo`(`idgrupo`) ON DELETE RESTRICT ON UPDATE CASCADE;
