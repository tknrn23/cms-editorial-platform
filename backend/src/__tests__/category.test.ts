import { describe, it, expect, beforeEach } from 'vitest';
import { CategoryService } from '../services/categoryService';
import { Database } from '../models/index';

describe('CategoryService', () => {
  beforeEach(() => {
    Database.categories.clear();
  });

  it('should create a category', () => {
    // Action
    const category = CategoryService.createCategory({
      name: 'Technology',
      description: 'Tech articles',
      color: '#3B82F6',
    });

    // Assert
    expect(category).toBeDefined();
    expect(category.name).toBe('Technology');
    expect(category.slug).toBe('technology');
    expect(category.id).toBeDefined();
  });

  it('should get all categories sorted by name', () => {
    // Setup
    CategoryService.createCategory({
      name: 'Zebra',
      description: 'Z category',
      color: '#3B82F6',
    });
    CategoryService.createCategory({
      name: 'Apple',
      description: 'A category',
      color: '#3B82F6',
    });

    // Action
    const categories = CategoryService.getAllCategories();

    // Assert
    expect(categories.length).toBe(2);
    expect(categories[0].name).toBe('Apple');
    expect(categories[1].name).toBe('Zebra');
  });

  it('should prevent deletion of used categories', () => {
    // Setup
    const category = CategoryService.createCategory({
      name: 'Tech',
      description: 'Tech articles',
      color: '#3B82F6',
    });

    Database.networks.set('net-1', {
      id: 'net-1',
      name: 'Tech Network',
      description: 'Tech network',
      createdAt: new Date(),
    });

    Database.articles.set('art-1', {
      id: 'art-1',
      title: 'Test',
      content: 'Test content that is long enough',
      excerpt: 'Test',
      author: 'Author',
      categories: [category.id],
      network: 'net-1',
      status: 'published',
      featured: false,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Assert
    expect(() => CategoryService.deleteCategory(category.id)).toThrow(
      'Impossible de supprimer une catégorie utilisée'
    );
  });
});
