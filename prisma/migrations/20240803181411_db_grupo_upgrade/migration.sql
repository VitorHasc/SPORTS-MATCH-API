-- DropIndex
DROP INDEX `Esporte_usuarioId_fkey` ON `esporte`;

-- DropIndex
DROP INDEX `MensagemInd_destinatarioId_fkey` ON `mensagemind`;

-- DropIndex
DROP INDEX `MensagemInd_remetenteId_fkey` ON `mensagemind`;

-- CreateTable
CREATE TABLE `Grupo` (
    `idgrupo` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(35) NOT NULL,
    `descricao` VARCHAR(500) NOT NULL,
    `perfilFoto` VARCHAR(191) NULL,

    UNIQUE INDEX `Grupo_idgrupo_key`(`idgrupo`),
    PRIMARY KEY (`idgrupo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Grupo_Usuario` (
    `idGU` INTEGER NOT NULL AUTO_INCREMENT,
    `adm` BOOLEAN NOT NULL,
    `usuarioId` INTEGER NOT NULL,
    `grupoId` INTEGER NOT NULL,

    UNIQUE INDEX `Grupo_Usuario_idGU_key`(`idGU`),
    INDEX `Grupo_Usuario_usuarioId_idx`(`usuarioId`),
    INDEX `Grupo_Usuario_grupoId_idx`(`grupoId`),
    UNIQUE INDEX `Grupo_Usuario_usuarioId_grupoId_key`(`usuarioId`, `grupoId`),
    PRIMARY KEY (`idGU`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
