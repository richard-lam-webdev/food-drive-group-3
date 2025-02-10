/*
  Warnings:

  - You are about to drop the column `adresse` on the `Utilisateurs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Utilisateurs` DROP COLUMN `adresse`,
    ADD COLUMN `codePostal` VARCHAR(191) NULL,
    ADD COLUMN `numeroRue` VARCHAR(191) NULL,
    ADD COLUMN `ville` VARCHAR(191) NULL;
