# Projet Drive Alimentaire avec Next.js

Ce projet est une application de type Drive alimentaire inspirée d'Auchan Drive, enrichie par l'intelligence artificielle. Elle permet aux utilisateurs de gérer leurs courses, créer des listes de courses à partir de photos de plats et recevoir des suggestions de recettes en fonction des ingrédients disponibles.

## Table des matières
1. [Fonctionnalités](#fonctionnalités)
2. [Technologies Utilisées](#technologies-utilisées)
3. [Installation](#installation)
4. [Docker](#docker)
5. [Contributeurs](#contributeurs)

## Fonctionnalités

- Recherche de produits avec filtres
- Ajout de produits à la liste de courses
- Création automatique de listes de courses à partir de photos de plats
- Suggestions de recettes basées sur les ingrédients de la liste de courses
- Commande et paiement en ligne
- Notifications de commande (email)
- Gestion des commandes pour les administrateurs

## Technologies Utilisées

- **Next.js** : Framework React pour le rendu côté serveur.
- **Docker** : Pour la conteneurisation et l’uniformité de l'environnement.
- **Base de données** : MySQL ou PostgreSQL (configurable).
- **Intégration IA** : Utilisation de modèles OpenAI et d'analyse d'images.
- **CSS** : TailwindCSS pour la stylisation.

## Installation

1. Clonez le projet :
   ```bash
   git clone https://github.com/richard-lam-webdev/food-drive-group-3.git
   cd nom-du-projet

2. Installez les dépendances :
   ```bash
  npm ou yarn install

3. Créez un fichier .env.local à la racine du projet et ajoutez vos variables d'environnement :
  DATABASE_URL=postgres://user:password@db:3306/dbname
  NEXT_PUBLIC_API_KEY=your_api_key

4. Build et lancer le projet en développement :
  npm run dev ou yarn dev

# Docker

## Démarrer le Projet avec Docker

1. Assurez-vous d'avoir Docker et Docker Compose installés.

2. Pour lancer l'application en développement :
  docker-compose up

3. Pour arrêter les services :
  docker-compose down




