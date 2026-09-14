import { describe, it, expect } from 'vitest';
import { validateData, createArticleSchema } from '../utils/validation';

describe('Validation', () => {
  it('should validate valid article data', () => {
    const data = {
      title: 'Test Article',
      content: 'This is a test article with enough content to pass validation',
      excerpt: 'Test excerpt',
      author: 'Test Author',
      categories: ['cat-1'],
      network: 'net-1',
      featured: false,
      status: 'draft',
    };

    const result = validateData(createArticleSchema, data);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it('should reject article with title too short', () => {
    const data = {
      title: 'Hi',
      content: 'This is a test article with enough content to pass validation',
      excerpt: 'Test excerpt',
      author: 'Test Author',
      categories: ['cat-1'],
      network: 'net-1',
    };

    const result = validateData(createArticleSchema, data);

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
  });

  it('should reject article without categories', () => {
    const data = {
      title: 'Test Article',
      content: 'This is a test article with enough content to pass validation',
      excerpt: 'Test excerpt',
      author: 'Test Author',
      categories: [],
      network: 'net-1',
    };

    const result = validateData(createArticleSchema, data);

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
  });
});
