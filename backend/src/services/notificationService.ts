import { v4 as uuidv4 } from 'uuid';
import { Database } from '../models/index.js';
import { ArticleService } from './articleService.js';
import { generateEmailHTML } from '../utils/email-template.js';
import type { EmailNotification } from '../types/index.js';

export class NotificationService {
  static getAllNotifications(): EmailNotification[] {
    return Array.from(Database.notifications.values())
      .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
  }

  static getNotificationById(id: string): EmailNotification | null {
    return Database.notifications.get(id) || null;
  }

  static sendEmailNotification(
    articleId: string,
    recipients: string[],
    subject: string
  ): { notification: EmailNotification; htmlContent: string } {
    const article = ArticleService.getArticleById(articleId);
    if (!article) {
      throw new Error('Article non trouvé');
    }

    const id = uuidv4();
    const htmlContent = generateEmailHTML(article, subject);

    const notification: EmailNotification = {
      id,
      articleId,
      recipients,
      subject,
      htmlContent,
      sentAt: new Date(),
      status: 'sent', // In real app, would track async email sending
    };

    Database.notifications.set(id, notification);

    // Log email sending
    console.log(`📧 Email envoyé à ${recipients.length} destinataire(s)`);
    console.log(`   Article: ${article.title}`);
    console.log(`   Sujet: ${subject}`);

    return { notification, htmlContent };
  }

  static failNotification(id: string): EmailNotification | null {
    const notification = Database.notifications.get(id);
    if (!notification) return null;

    const updated: EmailNotification = {
      ...notification,
      status: 'failed',
    };

    Database.notifications.set(id, updated);
    return updated;
  }

  static getNotificationStats() {
    const notifications = Array.from(Database.notifications.values());

    return {
      total: notifications.length,
      sent: notifications.filter(n => n.status === 'sent').length,
      failed: notifications.filter(n => n.status === 'failed').length,
      totalRecipients: notifications.reduce((sum, n) => sum + n.recipients.length, 0),
    };
  }

  static getLatestNotifications(limit: number = 5): EmailNotification[] {
    return Array.from(Database.notifications.values())
      .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
      .slice(0, limit);
  }
}
