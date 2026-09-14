import { v4 as uuidv4 } from 'uuid';
import { Database } from '../models/index.js';
import { ArticleService } from './articleService.js';
import { generateSlug, generateColor } from '../utils/slug.js';
import type { Category } from '../types/index.js';

export class CategoryService {
    static getAllCategories(): Category[] {
        return Array.from(Database.categories.values()).sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }

    static getCategoryById(id: string): Category | null {
        return Database.categories.get(id) || null;
    }

    static createCategory(data: Omit<Category, 'id' | 'createdAt'> & { slug?: string; color?: string }): Category {
        const id = uuidv4();
        const category: Category = {
            id,
            name: data.name,
            slug: data.slug || generateSlug(data.name),
            description: data.description,
            color: data.color || generateColor(),
            createdAt: new Date(),
        };

        Database.categories.set(id, category);
        return category;
    }

    static updateCategory(id: string, data: Partial<Category>): Category | null {
        const category = Database.categories.get(id);
        if (!category) return null;

        const updated: Category = {
            ...category,
            ...data,
            id: category.id,
            createdAt: category.createdAt,
            slug: data.slug || generateSlug(data.name || category.name),
        };

        Database.categories.set(id, updated);
        return updated;
    }

    static deleteCategory(id: string): boolean {
        // Check if category is used
        const articles = Array.from(Database.articles.values());
        const isUsed = articles.some(a => a.categories.includes(id));

        if (isUsed) {
            throw new Error('Impossible de supprimer une catégorie utilisée');
        }

        return Database.categories.delete(id);
    }

    static getCategoryStats(categoryId: string): { count: number; articles: string[] } {
        const articles = Array.from(Database.articles.values())
            .filter(a => a.categories.includes(categoryId))
            .filter(a => a.status === 'published');

        return {
            count: articles.length,
            articles: articles.map(a => a.id),
        };
    }
}
