import type { Request, Response } from 'express';
import { NotificationService } from '../services/notificationService.js';
import { ArticleService } from '../services/articleService.js';
import { validateData, sendEmailNotificationSchema } from '../utils/validation.js';

export class NotificationController {
  static getAll(req: Request, res: Response) {
    try {
      const notifications = NotificationService.getAllNotifications();
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const notification = NotificationService.getNotificationById(id);

      if (!notification) {
        return res.status(404).json({ error: 'Notification non trouvée' });
      }

      res.json(notification);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static send(req: Request, res: Response) {
    try {
      const { articleId } = req.params;
      const validation = validateData(sendEmailNotificationSchema, req.body);

      if (!validation.success) {
        return res.status(400).json({ errors: validation.errors });
      }

      // Verify article exists
      const article = ArticleService.getArticleById(articleId);
      if (!article) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      const { recipients, subject } = validation.data;
      const result = NotificationService.sendEmailNotification(articleId, recipients, subject);

      res.status(201).json({
        notification: result.notification,
        message: `Email envoyé à ${recipients.length} destinataire(s)`,
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static getStats(req: Request, res: Response) {
    try {
      const stats = NotificationService.getNotificationStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static getLatest(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const notifications = NotificationService.getLatestNotifications(limit);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
