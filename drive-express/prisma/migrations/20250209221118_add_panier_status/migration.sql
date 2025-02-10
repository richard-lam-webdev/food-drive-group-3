-- AlterTable
ALTER TABLE `Commandes` MODIFY `statut` ENUM('panier', 'en_cours_de_paiement', 'payee', 'en_preparation', 'expediee', 'livree') NOT NULL DEFAULT 'en_cours_de_paiement';

-- AlterTable
ALTER TABLE `HistoriqueCommandes` MODIFY `statut` ENUM('panier', 'en_cours_de_paiement', 'payee', 'en_preparation', 'expediee', 'livree') NOT NULL;
