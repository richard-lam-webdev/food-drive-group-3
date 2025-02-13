# Drive Express - Application de Drive Alimentaire  

Drive Express est une application de commande en ligne inspirée d'Auchan Drive, enrichie par l'intelligence artificielle.  
Elle permet aux utilisateurs de gérer leurs courses, créer des listes de courses à partir de photos de plats et recevoir des suggestions de recettes en fonction des ingrédients disponibles.  

---

## 📖 Table des matières  

- [🛠 Fonctionnalités](#fonctionnalités)  
- [💡 Technologies Utilisées](#technologies-utilisées)  
- [📌 Installation](#installation)  
- [🐳 Docker](#docker)  
- [👥 Contributeurs](#contributeurs)  


---


## 🛠 Fonctionnalités  

 - **Création automatique de listes de courses à partir de photos de plats**  
 - **Suggestions de recettes basées sur les ingrédients disponibles**  
 - **Commande et paiement en ligne sécurisé**  
 - **Notifications de commande par email**  
 - **Gestion des commandes pour les administrateurs**  


---


## 💡 Technologies Utilisées  

- **Next.js** - Framework React pour le rendu côté serveur et la navigation  
- **Docker** - Conteneurisation et uniformisation de l'environnement de développement  
- **Base de données** - MySQL (configurable avec PostgreSQL)  
- **Prisma** - ORM moderne pour la gestion de la base de données  
- **NextAuth.js** - Gestion de l’authentification des utilisateurs  
- **TailwindCSS** - Stylisation rapide et responsive  
- **Intégration IA** - Utilisation de modèles OpenAI et d'analyse d'images  


---



# 📌 Installation  

### **Cloner le projet**  
```sh
git clone https://github.com/richard-lam-webdev/food-drive-group-3.git
cd food-drive-group-3
```


### **Installer les dépendances**  
```sh
npm install
```



### **Configurer les variables d’environnement** 
Créez un fichier .env.local à la racine du projet et ajoutez vos variables :
```sh
DATABASE_URL="mysql://myuser:mypassword@db:3306/mydatabase"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_API_KEY=your_api_key
```



### **Lancer l’application en mode développement**  
```sh
npm run dev
```
Le projet sera accessible sur http://localhost:3000



### **Démarrer l’application avec Docker**  
```sh
docker-compose up
```


### **Arrêter les services Docker**  
```sh
docker-compose down
```



## 👥 Contributeurs  

| Nom          | Pseudo GitHub                        |
|-------------|-------------------------------------|
| **Richard LAM** | [richard-lam-webdev] |
| **Loanie URITY**  | [loanieurt] |
| **Damien DA SILVA** | [Dams25] |
