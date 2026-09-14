# CMS Editorial Platform

🎯 **Plateforme complète de gestion de contenu éditorial**

## 📋 Description

CMS Editorial Platform est une solution intégrée de gestion de contenu éditorial avec :
- 📰 Gestion complète des articles (CRUD)
- 🏷️ Système de catégories flexible
- 🌐 Gestion multi-réseaux
- 📧 Notifications email automatiques
- 📥 Import en masse de données
- 📊 Tableau de bord avec statistiques en temps réel
- 🎨 Interface utilisateur moderne et responsive

## 🏗️ Architecture

### Backend (Express + TypeScript)
- API REST complète
- Validation robuste avec Zod
- Base de données en mémoire (facilement remplaçable)
- Tests unitaires avec Vitest
- Gestion d'erreurs centralisée

### Frontend (React + TypeScript + Material-UI)
- Interface moderne et responsive
- Gestion d'état avec Zustand
- Routing avec React Router v6
- Visualisations avec Recharts
- Composants réutilisables

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm ou yarn

### Backend

```bash
cd backend
npm install
npm run dev  # Développement
npm run build  # Production
npm test  # Tests
```

### Frontend

```bash
cd frontend
npm install
npm run dev  # Développement
npm run build  # Production
```

## 📚 API Endpoints

### Articles
- `GET /api/articles` - Lister tous les articles (avec filtres)
- `GET /api/articles/:id` - Obtenir un article
- `POST /api/articles` - Créer un article
- `PUT /api/articles/:id` - Modifier un article
- `PATCH /api/articles/:id/status` - Changer le statut
- `DELETE /api/articles/:id` - Supprimer un article
- `GET /api/articles/stats` - Statistiques

### Catégories
- `GET /api/categories` - Lister toutes les catégories
- `GET /api/categories/:id` - Obtenir une catégorie
- `POST /api/categories` - Créer une catégorie
- `PUT /api/categories/:id` - Modifier une catégorie
- `DELETE /api/categories/:id` - Supprimer une catégorie
- `GET /api/categories/:id/stats` - Statistiques

### Réseaux
- `GET /api/networks` - Lister tous les réseaux
- `GET /api/networks/:id` - Obtenir un réseau
- `POST /api/networks` - Créer un réseau
- `PUT /api/networks/:id` - Modifier un réseau
- `DELETE /api/networks/:id` - Supprimer un réseau
- `GET /api/networks/:id/stats` - Statistiques

### Notifications
- `GET /api/notifications` - Lister toutes les notifications
- `GET /api/notifications/:id` - Obtenir une notification
- `POST /api/notifications/:articleId/send` - Envoyer une notification
- `GET /api/notifications/stats` - Statistiques
- `GET /api/notifications/latest` - Dernières notifications

### Import
- `POST /api/import/articles` - Importer des articles en masse

### Tableeau de Bord
- `GET /api/dashboard/stats` - Statistiques globales
- `GET /api/health` - Vérification de santé

## 🎨 Structure du Projet

```
cms-editorial-platform/
├── backend/
│   ├── src/
│   │   ├── index.ts           # Point d'entrée serveur
│   │   ├── controllers/        # Contrôleurs API
│   │   ├── services/           # Logique métier
│   │   ├── models/             # Modèles de données
│   │   ├── routes/             # Routes API
│   │   ├── utils/              # Utilitaires
│   │   └── __tests__/          # Tests unitaires
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── main.tsx            # Point d'entrée React
│   │   ├── App.tsx             # Application principale
│   │   ├── components/         # Composants réutilisables
│   │   ├── pages/              # Pages de l'application
│   │   ├── services/           # Services API
│   │   ├── store/              # État global (Zustand)
│   │   └── types/              # Types TypeScript
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
└── README.md
```

## 📖 Fonctionnalités

### 📰 Gestion des Articles
- Créer, lire, modifier, supprimer des articles
- Filtrer par statut, réseau, catégorie
- Gérer les brouillons et publication
- Mettre en avant les articles vedettes
- Historique des modifications

### 🏷️ Catégories
- Créer et organiser les catégories
- Assigner une couleur personnalisée
- Générer automatiquement des slugs
- Voir les articles par catégorie
- Prévenir la suppression de catégories utilisées

### 🌐 Réseaux
- Gérer plusieurs réseaux de diffusion
- Attribuer les articles à des réseaux
- Statistiques par réseau

### 📧 Notifications Email
- Envoyer des emails aux abonnés
- Modèles d'emails personnalisés
- Historique des envois
- Statut de livraison

### 📥 Import en Masse
- Importer des articles depuis JSON
- Créer automatiquement les catégories et réseaux
- Rapport détaillé d'import
- Gestion des erreurs

### 📊 Tableau de Bord
- Statistiques en temps réel
- Graphiques (articles par catégorie, par réseau)
- Derniers articles publiés
- Dernières notifications

## 🔒 Sécurité

- Validation stricte avec Zod
- CORS configuré
- Gestion d'erreurs centralisée
- Types TypeScript strict

## 🧪 Tests

Lancer les tests :

```bash
cd backend
npm test
```

Tests inclus :
- Création d'articles
- Filtrage d'articles
- Gestion des catégories
- Validation des données

## 📱 Interface Utilisateur

- ✅ Design responsive
- ✅ Thème sombre optionnel
- ✅ Navigation intuitive
- ✅ Tableaux paginés
- ✅ Dialogues de confirmation
- ✅ Gestion des erreurs
- ✅ Indicateurs de chargement
- ✅ Notifications toast

## 🔧 Configuration

### Variables d'environnement Backend

```
PORT=3001
NODE_ENV=development
```

### Variables d'environnement Frontend

```
VITE_API_URL=http://localhost:3001/api
```

## 📝 Exemples d'Utilisation

### Créer un article

```bash
curl -X POST http://localhost:3001/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mon premier article",
    "content": "Contenu détaillé de l'\'article...",
    "excerpt": "Un court résumé",
    "author": "Jean Dupont",
    "categories": ["cat-1"],
    "network": "net-1",
    "status": "draft",
    "featured": false
  }'
```

### Importer des articles

```bash
curl -X POST http://localhost:3001/api/import/articles \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {
        "title": "Article importé",
        "content": "Contenu...",
        "excerpt": "Résumé",
        "author": "Auteur",
        "category": "Tech",
        "network": "Blog"
      }
    ]
  }'
```

## 🚦 Statut du Projet

✅ Backend complet
✅ Frontend complet
✅ Tests unitaires
✅ Documentation
🔄 Tests d'intégration
🔄 Authentification (optionnel)
🔄 Base de données persistante (PostgreSQL)

## 📄 Licence

MIT

## 🤝 Contributions

Les contributions sont bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📧 Contact

Pour toute question ou suggestion, contactez : tknrn23@github.com

---

**Développé avec ❤️ en 2026**
