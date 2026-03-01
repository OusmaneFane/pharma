# PharmaConnect Mali

Marketplace santé : mise en relation clients et pharmacies (commandes, offres, paiement Mobile Money, chat).

## Démarrage du projet

### 1. Prérequis

- **PHP** 8.2+ (avec extensions : mbstring, xml, pdo, sqlite, etc.)
- **Composer**
- **Node.js** 18+ et **npm**

### 2. Installation

```bash
# Cloner ou aller dans le projet
cd pharma

# Dépendances PHP
composer install

# Dépendances JavaScript
npm install
```

### 3. Configuration

```bash
# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate
```

Configurer la base de données dans `.env` (par défaut SQLite) :

- **SQLite** (recommandé pour le dev) : laisser `DB_CONNECTION=sqlite` et s’assurer que `database/database.sqlite` existe (créé à l’étape suivante si besoin).
- **MySQL** : renseigner `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`.

### 4. Base de données

```bash
# Créer la base SQLite si elle n'existe pas (optionnel avec SQLite)
touch database/database.sqlite

# Migrations + données de test
php artisan migrate --seed
```

Pour repartir de zéro avec des données fraîches :

```bash
php artisan migrate:fresh --seed
```

### 5. Lancer l’application

Ouvrir **deux terminaux** :

**Terminal 1 — serveur PHP :**

```bash
php artisan serve
```

L’app sera accessible sur **http://localhost:8000**

**Terminal 2 — assets (Vite) :**

```bash
npm run dev
```

Laisser les deux commandes tourner pendant le développement.

### 6. Se connecter pour tester

- **URL :** http://localhost:8000  
- **Mot de passe commun :** `password`

Quelques comptes :

| Rôle      | Email                    |
|-----------|--------------------------|
| Admin     | admin@pharmaconnect.ml   |
| Client    | client1@pharmaconnect.ml |
| Pharmacie | pharma1@pharmaconnect.ml  |

Liste complète : voir `database/seeders/SEEDER_ACCOUNTS.md`.

---

## Commandes utiles

| Commande | Description |
|----------|-------------|
| `php artisan serve` | Serveur web Laravel (port 8000) |
| `npm run dev` | Vite (front React/Inertia) |
| `npm run build` | Build production des assets |
| `php artisan migrate:fresh --seed` | Réinitialiser la BDD et reseeder |
| `php artisan db:seed` | Lancer uniquement les seeders |

---

## Stack

- **Backend :** Laravel, Fortify (auth), Inertia
- **Frontend :** React (TypeScript), Vite, Tailwind CSS
- **Base :** SQLite / MySQL
