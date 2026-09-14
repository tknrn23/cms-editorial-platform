import type { Request, Response } from 'express';
import { CategoryService } from '../services/categoryService.js';
import { validateData, createCategorySchema, updateCategorySchema } from '../utils/validation.js';

export class CategoryController {
  static getAll(req: Request, res: Response) {
    try {
      const categories = CategoryService.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const category = CategoryService.getCategoryById(id);

      if (!category) {
        return res.status(404).json({ error: 'Catégorie non trouvée' });
      }

      res.json(category);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static create(req: Request, res: Response) {
    try {
      const validation = validateData(createCategorySchema, req.body);
      if (!validation.success) {
        return res.status(400).json({ errors: validation.errors });
      }

      const category = CategoryService.createCategory(validation.data);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validation = validateData(updateCategorySchema, req.body);
      if (!validation.success) {
        return res.status(400).json({ errors: validation.errors });
      }

      const category = CategoryService.updateCategory(id, validation.data);
      if (!category) {
        return res.status(404).json({ error: 'Catégorie non trouvée' });
      }

      res.json(category);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      try {
        const deleted = CategoryService.deleteCategory(id);
        if (!deleted) {
          return res.status(404).json({ error: 'Catégorie non trouvée' });
        }
        res.json({ message: 'Catégorie supprimée' });
      } catch (error) {
        res.status(400).json({ error: (error as Error).message });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static getStats(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const stats = CategoryService.getCategoryStats(id);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
