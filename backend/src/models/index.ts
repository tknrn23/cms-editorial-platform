import { v4 as uuidv4 } from 'uuid';
import type { Article, Category, Network, EmailNotification, ArticleStatus } from '../types/index.js';

// In-memory database
export class Database {
    static articles: Map<string, Article> = new Map();
    static categories: Map<string, Category> = new Map();
    static networks: Map<string, Network> = new Map();
    static notifications: Map<string, EmailNotification> = new Map();

    static init() {
        // Initialize networks
        const networks: Network[] = [
            {
                id: 'net-tech',
                name: 'Tech Innovators',
                description: 'Communauté des passionnés de technologie',
                createdAt: new Date('2024-01-01'),
            },
            {
                id: 'net-lifestyle',
                name: 'Lifestyle & Bien-être',
                description: 'Articles sur le bien-être et le lifestyle',
                createdAt: new Date('2024-01-01'),
            },
        ];

        networks.forEach(net => {
            Database.networks.set(net.id, net);
        });

        // Initialize categories
        const categories: Category[] = [
            {
                id: 'cat-1',
                name: 'Développement Web',
                slug: 'dev-web',
                description: 'Articles sur le développement web moderne',
                color: '#3B82F6',
                createdAt: new Date('2024-01-01'),
            },
            {
                id: 'cat-2',
                name: 'Intelligence Artificielle',
                slug: 'ai',
                description: 'IA et Machine Learning',
                color: '#EC4899',
                createdAt: new Date('2024-01-01'),
            },
            {
                id: 'cat-3',
                name: 'DevOps',
                slug: 'devops',
                description: 'Infrastructure et DevOps',
                color: '#F59E0B',
                createdAt: new Date('2024-01-01'),
            },
            {
                id: 'cat-4',
                name: 'Nutrition',
                slug: 'nutrition',
                description: 'Conseils nutritionnels',
                color: '#10B981',
                createdAt: new Date('2024-01-01'),
            },
            {
                id: 'cat-5',
                name: 'Fitness',
                slug: 'fitness',
                description: 'Exercices et training',
                color: '#EF4444',
                createdAt: new Date('2024-01-01'),
            },
        ];

        categories.forEach(cat => {
            Database.categories.set(cat.id, cat);
        });

        // Initialize demo articles
        const articles: Article[] = [
            {
                id: 'art-1',
                title: 'React 19: Les nouvelles fonctionnalités expliquées',
                content: 'React 19 apporte des améliorations significatives en matière de performance et d\'ergonomie développeur. Découvrez les hooks révolutionnaires, la compilation optimisée et les nouvelles API pour la gestion d\'état. Ce guide complet vous permettra de maîtriser les changements et de les intégrer progressivement dans vos projets existants.',
                excerpt: 'Découvrez les innovations de React 19 et comment les utiliser efficacement',
                author: 'Jean Dupont',
                categories: ['cat-1'],
                network: 'net-tech',
                status: 'published',
                featured: true,
                publishedAt: new Date('2024-12-01'),
                createdAt: new Date('2024-11-20'),
                updatedAt: new Date('2024-12-01'),
            },
            {
                id: 'art-2',
                title: 'TypeScript pour les débutants',
                content: 'TypeScript transforme votre développement JavaScript en le rendant plus sûr et plus maintenable. Ce tutoriel couvre les types de base, les interfaces avancées, les génériques et les décorateurs. Vous apprendrez également les meilleures pratiques et les pièges courants à éviter.',
                excerpt: 'Un guide complet pour débuter avec TypeScript',
                author: 'Marie Martin',
                categories: ['cat-1'],
                network: 'net-tech',
                status: 'published',
                featured: false,
                publishedAt: new Date('2024-11-28'),
                createdAt: new Date('2024-11-15'),
                updatedAt: new Date('2024-11-28'),
            },
            {
                id: 'art-3',
                title: 'Kubernetes pour la production',
                content: 'Déployer en production avec Kubernetes ne doit pas être une source de stress. Apprenez les concepts fondamentaux, la configuration des clusters, la gestion des ressources, et les meilleures pratiques de sécurité. Ce guide vous accompagnera du développement à la production stable.',
                excerpt: 'Maîtrisez Kubernetes en production',
                author: 'Pierre Bernard',
                categories: ['cat-3'],
                network: 'net-tech',
                status: 'published',
                featured: true,
                publishedAt: new Date('2024-11-25'),
                createdAt: new Date('2024-11-10'),
                updatedAt: new Date('2024-11-25'),
            },
            {
                id: 'art-4',
                title: 'GPT-4 et les assistants IA: L\'avenir du développement',
                content: 'L\'Intelligence Artificielle révolutionne la façon dont nous développons. GPT-4 et ses variantes offrent des capacités inédites pour la génération de code, la documentation et les tests. Découvrez comment intégrer ces outils efficacement dans votre workflow.',
                excerpt: 'Comment les assistants IA transforment le développement',
                author: 'Sophie Laurent',
                categories: ['cat-2'],
                network: 'net-tech',
                status: 'published',
                featured: false,
                publishedAt: new Date('2024-11-20'),
                createdAt: new Date('2024-11-05'),
                updatedAt: new Date('2024-11-20'),
            },
            {
                id: 'art-5',
                title: 'Monolithes vs Microservices: Quelle architecture choisir?',
                content: 'Le choix entre une architecture monolithique et microservices n\'est pas simple. Cet article explore les avantages et inconvénients de chaque approche, les cas d\'usage appropriés, et comment migrer progressivement. Nous couvrons également les patterns d\'implémentation et les pièges courants.',
                excerpt: 'Guide complet pour choisir votre architecture',
                author: 'Luc Moreau',
                categories: ['cat-3'],
                network: 'net-tech',
                status: 'draft',
                featured: false,
                publishedAt: null,
                createdAt: new Date('2024-11-18'),
                updatedAt: new Date('2024-12-05'),
            },
            {
                id: 'art-6',
                title: 'Les meilleures pratiques de nutrition pour le fitness',
                content: 'Atteindre vos objectifs fitness demande une nutrition adaptée. Découvrez les macronutriments essentiels, les timing optimaux, et les plans nutritionnels personnalisés. Nous vous guide à travers les mythes courants et les stratégies éprouvées par les professionnels.',
                excerpt: 'Optimisez votre nutrition pour les meilleures performances',
                author: 'Dr. Claire Fontaine',
                categories: ['cat-4', 'cat-5'],
                network: 'net-lifestyle',
                status: 'published',
                featured: true,
                publishedAt: new Date('2024-11-30'),
                createdAt: new Date('2024-11-12'),
                updatedAt: new Date('2024-11-30'),
            },
            {
                id: 'art-7',
                title: 'Yoga quotidien: 5 asanas essentielles',
                content: 'Le yoga est bien plus qu\'un simple exercice; c\'est une pratique holistique pour le bien-être. Découvrez les 5 asanas fondamentales que vous pouvez pratiquer chaque jour pour améliorer votre flexibilité, votre force et votre équilibre mental.',
                excerpt: 'Débuter le yoga avec les postures essentielles',
                author: 'Amelie Rousseau',
                categories: ['cat-5'],
                network: 'net-lifestyle',
                status: 'published',
                featured: false,
                publishedAt: new Date('2024-11-27'),
                createdAt: new Date('2024-11-08'),
                updatedAt: new Date('2024-11-27'),
            },
            {
                id: 'art-8',
                title: 'Méditation pour débutants: Guide pratique',
                content: 'La méditation est une pratique accessible à tous qui peut transformer votre vie. Cet article vous guide à travers les techniques de base, les meilleures moments pour méditer, et comment surmonter les défis courants des débutants.',
                excerpt: 'Commencez votre pratique de méditation aujourd\'hui',
                author: 'Marc Lefebvre',
                categories: ['cat-4'],
                network: 'net-lifestyle',
                status: 'draft',
                featured: false,
                publishedAt: null,
                createdAt: new Date('2024-11-22'),
                updatedAt: new Date('2024-12-03'),
            },
            {
                id: 'art-9',
                title: 'Docker et containerization: Les bases',
                content: 'Docker révolutionne le déploiement d\'applications en standardisant les environnements. Apprenez les concepts fondamentaux de la containerization, comment créer des images Docker, et les meilleures pratiques de sécurité.',
                excerpt: 'Maîtrisez Docker et la containerization',
                author: 'Nicolas Renard',
                categories: ['cat-3'],
                network: 'net-tech',
                status: 'published',
                featured: false,
                publishedAt: new Date('2024-11-24'),
                createdAt: new Date('2024-11-09'),
                updatedAt: new Date('2024-11-24'),
            },
            {
                id: 'art-10',
                title: 'GraphQL vs REST: Comparaison détaillée',
                content: 'GraphQL offre une alternative moderne à REST pour les APIs. Découvrez les avantages et inconvénients de chaque approche, quand utiliser GraphQL, et comment l\'implémenter efficacement. Ce guide couvre aussi les patterns avancés et la sécurité.',
                excerpt: 'Choisissez entre GraphQL et REST pour votre API',
                author: 'Valerie Deschamps',
                categories: ['cat-1'],
                network: 'net-tech',
                status: 'published',
                featured: true,
                publishedAt: new Date('2024-11-23'),
                createdAt: new Date('2024-11-03'),
                updatedAt: new Date('2024-11-23'),
            },
            {
                id: 'art-11',
                title: 'Brûler des calories: Les exercices les plus efficaces',
                content: 'Vous voulez perdre du poids? Découvrez les exercices qui brûlent le plus de calories et comment les combiner pour une séance optimale. Incluez des conseils sur la fréquence, la durée et comment adapter votre entraînement selon votre niveau.',
                excerpt: 'Les meilleurs exercices pour brûler des calories rapidement',
                author: 'Thomas Bernard',
                categories: ['cat-5'],
                network: 'net-lifestyle',
                status: 'published',
                featured: false,
                publishedAt: new Date('2024-11-29'),
                createdAt: new Date('2024-11-14'),
                updatedAt: new Date('2024-11-29'),
            },
            {
                id: 'art-12',
                title: 'Machine Learning en production: Défis et solutions',
                content: 'Mettre un modèle ML en production est bien plus complexe que l\'entraîner. Découvrez les défis du ML en production, les frameworks disponibles, et les meilleures pratiques pour assurer la performance et la fiabilité de vos modèles.',
                excerpt: 'Déployer et maintenir des modèles ML en production',
                author: 'Isabelle Cowan',
                categories: ['cat-2'],
                network: 'net-tech',
                status: 'published',
                featured: true,
                publishedAt: new Date('2024-11-26'),
                createdAt: new Date('2024-11-07'),
                updatedAt: new Date('2024-11-26'),
            },
        ];

        articles.forEach(art => {
            Database.articles.set(art.id, art);
        });
    }
}
