/*
  Warnings:

  - The values [en_preparation,expediee,livree] on the enum `HistoriqueCommandes_statut` will be removed. If these variants are still used in the database, this will fail.
  - The values [en_preparation,expediee,livree] on the enum `HistoriqueCommandes_statut` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Commandes` MODIFY `statut` ENUM('panier', 'en_cours_de_paiement', 'payee', 'pretelivrable', 'traite') NOT NULL DEFAULT 'en_cours_de_paiement';

-- AlterTable
ALTER TABLE `HistoriqueCommandes` MODIFY `statut` ENUM('panier', 'en_cours_de_paiement', 'payee', 'pretelivrable', 'traite') NOT NULL;
