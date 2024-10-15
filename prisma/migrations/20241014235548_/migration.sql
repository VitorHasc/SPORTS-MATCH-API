-- DropIndex
DROP INDEX `Esporte_usuarioId_fkey` ON `esporte`;

-- DropIndex
DROP INDEX `Grupo_Usuario_grupoId_fkey` ON `grupo_usuario`;

-- DropIndex
DROP INDEX `Grupo_Usuario_usuarioId_fkey` ON `grupo_usuario`;

-- DropIndex
DROP INDEX `MensagemInd_destinatarioId_fkey` ON `mensagemind`;

-- DropIndex
DROP INDEX `MensagemInd_remetenteId_fkey` ON `mensagemind`;

-- CreateTable
CREATE TABLE `MensagemGrupo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `grupoId` INTEGER NOT NULL,
    `remetenteId` INTEGER NOT NULL,
    `conteudo` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Esporte` ADD CONSTRAINT `Esporte_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`idusuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MensagemInd` ADD CONSTRAINT `MensagemInd_remetenteId_fkey` FOREIGN KEY (`remetenteId`) REFERENCES `Usuario`(`idusuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MensagemInd` ADD CONSTRAINT `MensagemInd_destinatarioId_fkey` FOREIGN KEY (`destinatarioId`) REFERENCES `Usuario`(`idusuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MensagemGrupo` ADD CONSTRAINT `MensagemGrupo_grupoId_fkey` FOREIGN KEY (`grupoId`) REFERENCES `Grupo`(`idgrupo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MensagemGrupo` ADD CONSTRAINT `MensagemGrupo_remetenteId_fkey` FOREIGN KEY (`remetenteId`) REFERENCES `Usuario`(`idusuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Grupo_Usuario` ADD CONSTRAINT `Grupo_Usuario_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`idusuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Grupo_Usuario` ADD CONSTRAINT `Grupo_Usuario_grupoId_fkey` FOREIGN KEY (`grupoId`) REFERENCES `Grupo`(`idgrupo`) ON DELETE RESTRICT ON UPDATE CASCADE;
