import { describe, it, expect, beforeEach } from 'vitest';
import { ArticleService } from '../services/articleService';
import { CategoryService } from '../services/categoryService';
import { Database } from '../models/index';

describe('ArticleService', () => {
  beforeEach(() => {
    Database.articles.clear();
    Database.categories.clear();
    Database.networks.clear();
  });

  it('should create an article', () => {
    // Setup
    Database.categories.set('cat-1', {
      id: 'cat-1',
      name: 'Tech',
      slug: 'tech',
      description: 'Technology',
      color: '#3B82F6',
      createdAt: new Date(),
    });
    Database.networks.set('net-1', {
      id: 'net-1',
      name: 'Tech Network',
      description: 'Tech network',
      createdAt: new Date(),
    });

    // Action
    const article = ArticleService.createArticle({
      title: 'Test Article',
      content: 'This is a test article with enough content to pass validation',
      excerpt: 'Test excerpt',
      author: 'Test Author',
      categories: ['cat-1'],
      network: 'net-1',
      status: 'draft',
      featured: false,
    });

    // Assert
    expect(article).toBeDefined();
    expect(article.title).toBe('Test Article');
    expect(article.status).toBe('draft');
    expect(article.id).toBeDefined();
  });

  it('should filter articles by status', () => {
    // Setup
    Database.categories.set('cat-1', {
      id: 'cat-1',
      name: 'Tech',
      slug: 'tech',
      description: 'Technology',
      color: '#3B82F6',
      createdAt: new Date(),
    });
    Database.networks.set('net-1', {
      id: 'net-1',
      name: 'Tech Network',
      description: 'Tech network',
      createdAt: new Date(),
    });

    ArticleService.createArticle({
      title: 'Published Article',
      content: 'This is a published article with enough content',
      excerpt: 'Published excerpt',
      author: 'Author',
      categories: ['cat-1'],
      network: 'net-1',
      status: 'published',
      featured: false,
    });

    ArticleService.createArticle({
      title: 'Draft Article',
      content: 'This is a draft article with enough content',
      excerpt: 'Draft excerpt',
      author: 'Author',
      categories: ['cat-1'],
      network: 'net-1',
      status: 'draft',
      featured: false,
    });

    // Action
    const result = ArticleService.getAllArticles({ status: 'published' });

    // Assert
    expect(result.total).toBe(1);
    expect(result.data[0].status).toBe('published');
  });

  it('should update article status', () => {
    // Setup
    Database.categories.set('cat-1', {
      id: 'cat-1',
      name: 'Tech',
      slug: 'tech',
      description: 'Technology',
      color: '#3B82F6',
      createdAt: new Date(),
    });
    Database.networks.set('net-1', {
      id: 'net-1',
      name: 'Tech Network',
      description: 'Tech network',
      createdAt: new Date(),
    });

    const article = ArticleService.createArticle({
      title: 'Test Article',
      content: 'This is a test article with enough content to pass validation',
      excerpt: 'Test excerpt',
      author: 'Test Author',
      categories: ['cat-1'],
      network: 'net-1',
      status: 'draft',
      featured: false,
    });

    // Action
    const updated = ArticleService.updateArticleStatus(article.id, 'published');

    // Assert
    expect(updated).toBeDefined();
    expect(updated?.status).toBe('published');
    expect(updated?.publishedAt).toBeDefined();
  });
});
