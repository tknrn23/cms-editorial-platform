import type { Request, Response } from 'express';
import { ArticleService } from '../services/articleService.js';
import { CategoryService } from '../services/categoryService.js';
import { NetworkService } from '../services/networkService.js';
import { validateData, importDataSchema } from '../utils/validation.js';

export class ImportController {
  static importArticles(req: Request, res: Response) {
    try {
      const { data } = req.body;

      if (!Array.isArray(data)) {
        return res.status(400).json({ error: 'Les données doivent être un tableau' });
      }

      const validation = validateData(importDataSchema, data);
      if (!validation.success) {
        return res.status(400).json({ errors: validation.errors });
      }

      const results = {
        success: 0,
        failed: 0,
        errors: [] as Array<{ row: number; error: string }>,
        importedIds: [] as string[],
      };

      validation.data.forEach((item, index) => {
        try {
          // Find or create category
          let category = Array.from(CategoryService.getAllCategories()).find(
            c => c.name.toLowerCase() === item.category.toLowerCase()
          );

          if (!category) {
            category = CategoryService.createCategory({
              name: item.category,
              description: `Catégorie ${item.category}`,
              color: '#' + Math.floor(Math.random() * 16777215).toString(16),
            });
          }

          // Find or create network
          let network = Array.from(NetworkService.getAllNetworks()).find(
            n => n.name.toLowerCase() === item.network.toLowerCase()
          );

          if (!network) {
            network = NetworkService.createNetwork({
              name: item.network,
              description: `Réseau ${item.network}`,
            });
          }

          // Create article
          const article = ArticleService.createArticle({
            title: item.title,
            content: item.content,
            excerpt: item.excerpt,
            author: item.author,
            categories: [category.id],
            network: network.id,
            status: 'published',
            featured: false,
          });

          results.success++;
          results.importedIds.push(article.id);
        } catch (error) {
          results.failed++;
          results.errors.push({
            row: index + 1,
            error: (error as Error).message,
          });
        }
      });

      res.json(results);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
