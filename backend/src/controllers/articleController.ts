import type { Request, Response } from 'express';
import { ArticleService } from '../services/articleService.js';
import { CategoryService } from '../services/categoryService.js';
import { NetworkService } from '../services/networkService.js';
import { validateData, createArticleSchema, updateArticleSchema, articleFilterSchema } from '../utils/validation.js';

export class ArticleController {
  static getAll(req: Request, res: Response) {
    try {
      const validation = validateData(articleFilterSchema, req.query);
      if (!validation.success) {
        return res.status(400).json({ errors: validation.errors });
      }

      const result = ArticleService.getAllArticles(validation.data);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const article = ArticleService.getArticleById(id);

      if (!article) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      res.json(article);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static create(req: Request, res: Response) {
    try {
      const validation = validateData(createArticleSchema, req.body);
      if (!validation.success) {
        return res.status(400).json({ errors: validation.errors });
      }

      // Verify categories exist
      for (const catId of validation.data.categories) {
        if (!CategoryService.getCategoryById(catId)) {
          return res.status(400).json({ error: `Catégorie ${catId} inexistante` });
        }
      }

      // Verify network exists
      if (!NetworkService.getNetworkById(validation.data.network)) {
        return res.status(400).json({ error: 'Réseau inexistant' });
      }

      const article = ArticleService.createArticle(validation.data);
      res.status(201).json(article);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validation = validateData(updateArticleSchema, req.body);
      if (!validation.success) {
        return res.status(400).json({ errors: validation.errors });
      }

      const article = ArticleService.updateArticle(id, validation.data);
      if (!article) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      res.json(article);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = ArticleService.deleteArticle(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      res.json({ message: 'Article supprimé' });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['draft', 'published', 'archived'].includes(status)) {
        return res.status(400).json({ error: 'Statut invalide' });
      }

      const article = ArticleService.updateArticleStatus(id, status);
      if (!article) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      res.json(article);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static getStatistics(req: Request, res: Response) {
    try {
      const stats = ArticleService.getStatistics();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
