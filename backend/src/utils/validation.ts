import { z } from 'zod';
import type { ArticleStatus } from '../types/index.js';

// Article validation schemas
export const articleStatusSchema = z.enum(['draft', 'published', 'archived'] as const);

export const createArticleSchema = z.object({
  title: z.string().min(5, 'Le titre doit avoir au moins 5 caractères'),
  content: z.string().min(50, 'Le contenu doit avoir au moins 50 caractères'),
  excerpt: z.string().min(10, 'L\'extrait doit avoir au moins 10 caractères'),
  author: z.string().min(1, 'L\'auteur est obligatoire'),
  categories: z.array(z.string()).min(1, 'Au moins une catégorie est requise'),
  network: z.string().min(1, 'Le réseau est obligatoire'),
  featured: z.boolean().default(false),
  status: articleStatusSchema.default('draft'),
});

export const updateArticleSchema = createArticleSchema.partial();

export const articleFilterSchema = z.object({
  status: articleStatusSchema.optional(),
  categories: z.array(z.string()).optional(),
  network: z.string().optional(),
  featured: z.boolean().optional(),
  search: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

// Category validation schemas
export const createCategorySchema = z.object({
  name: z.string().min(2, 'Le nom doit avoir au moins 2 caractères'),
  description: z.string().min(5, 'La description doit avoir au moins 5 caractères'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Couleur hexadécimale invalide'),
});

export const updateCategorySchema = createCategorySchema.partial();

// Network validation schemas
export const createNetworkSchema = z.object({
  name: z.string().min(2, 'Le nom doit avoir au moins 2 caractères'),
  description: z.string().min(5, 'La description doit avoir au moins 5 caractères'),
});

export const updateNetworkSchema = createNetworkSchema.partial();

// Email notification validation
export const sendEmailNotificationSchema = z.object({
  recipients: z.array(z.string().email()).min(1, 'Au moins un destinataire requis'),
  subject: z.string().min(5, 'Le sujet doit avoir au moins 5 caractères'),
});

// Import data validation
export const importArticleSchema = z.object({
  title: z.string(),
  content: z.string(),
  excerpt: z.string(),
  author: z.string(),
  category: z.string(),
  network: z.string(),
});

export const importDataSchema = z.array(importArticleSchema);

// Validation helper
export function validateData<T>(schema: z.ZodSchema, data: unknown): { success: boolean; data?: T; errors?: Record<string, string> } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData as T };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach(err => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { form: 'Erreur de validation' } };
  }
}
