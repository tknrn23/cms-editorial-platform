import { v4 as uuidv4 } from 'uuid';
import { Database } from '../models/index.js';
import type { Article, ArticleFilters, PaginatedResponse } from '../types/index.js';

export class ArticleService {
  static getAllArticles(filters: ArticleFilters): PaginatedResponse<Article> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;

    let articles = Array.from(Database.articles.values());

    // Apply filters
    if (filters.status) {
      articles = articles.filter(a => a.status === filters.status);
    }

    if (filters.network) {
      articles = articles.filter(a => a.network === filters.network);
    }

    if (filters.featured !== undefined) {
      articles = articles.filter(a => a.featured === filters.featured);
    }

    if (filters.categories && filters.categories.length > 0) {
      articles = articles.filter(a => 
        filters.categories!.some(cat => a.categories.includes(cat))
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      articles = articles.filter(a =>
        a.title.toLowerCase().includes(searchLower) ||
        a.content.toLowerCase().includes(searchLower) ||
        a.excerpt.toLowerCase().includes(searchLower)
      );
    }

    // Sort by date
    articles.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    // Paginate
    const startIdx = (page - 1) * limit;
    const endIdx = startIdx + limit;
    const paginatedArticles = articles.slice(startIdx, endIdx);

    return {
      data: paginatedArticles,
      total: articles.length,
      page,
      limit,
      totalPages: Math.ceil(articles.length / limit),
    };
  }

  static getArticleById(id: string): Article | null {
    return Database.articles.get(id) || null;
  }

  static createArticle(data: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'> & { publishedAt?: Date | null }): Article {
    const id = uuidv4();
    const now = new Date();
    const article: Article = {
      id,
      ...data,
      publishedAt: data.publishedAt || null,
      createdAt: now,
      updatedAt: now,
    };

    Database.articles.set(id, article);
    return article;
  }

  static updateArticle(id: string, data: Partial<Article>): Article | null {
    const article = Database.articles.get(id);
    if (!article) return null;

    const updated: Article = {
      ...article,
      ...data,
      id: article.id,
      createdAt: article.createdAt,
      updatedAt: new Date(),
    };

    Database.articles.set(id, updated);
    return updated;
  }

  static deleteArticle(id: string): boolean {
    return Database.articles.delete(id);
  }

  static updateArticleStatus(id: string, status: 'draft' | 'published' | 'archived'): Article | null {
    const article = Database.articles.get(id);
    if (!article) return null;

    const publishedAt = status === 'published' ? new Date() : article.publishedAt;
    return this.updateArticle(id, { status, publishedAt });
  }

  static getStatistics() {
    const articles = Array.from(Database.articles.values());
    const networks = Array.from(Database.networks.values());

    const stats = {
      totalArticles: articles.length,
      byStatus: {
        draft: articles.filter(a => a.status === 'draft').length,
        published: articles.filter(a => a.status === 'published').length,
        archived: articles.filter(a => a.status === 'archived').length,
      },
      byNetwork: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      featured: articles.filter(a => a.featured).length,
    };

    articles.forEach(article => {
      // By network
      if (!stats.byNetwork[article.network]) {
        stats.byNetwork[article.network] = 0;
      }
      stats.byNetwork[article.network]++;

      // By category
      article.categories.forEach(cat => {
        if (!stats.byCategory[cat]) {
          stats.byCategory[cat] = 0;
        }
        stats.byCategory[cat]++;
      });
    });

    return stats;
  }

  static getLatestArticles(limit: number = 5): Article[] {
    return Array.from(Database.articles.values())
      .filter(a => a.status === 'published')
      .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime())
      .slice(0, limit);
  }
}
