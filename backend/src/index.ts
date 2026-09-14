import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { Database } from './models/index.js';
import articleRoutes from './routes/articles.js';
import categoryRoutes from './routes/categories.js';
import networkRoutes from './routes/networks.js';
import notificationRoutes from './routes/notifications.js';
import importRoutes from './routes/import.js';

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Une erreur interne est survenue' });
});

// Routes
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/networks', networkRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/import', importRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Dashboard stats endpoint
app.get('/api/dashboard/stats', (req: Request, res: Response) => {
  try {
    const articles = Array.from(Database.articles.values());
    const networks = Array.from(Database.networks.values());
    const categories = Array.from(Database.categories.values());
    const notifications = Array.from(Database.notifications.values());

    const stats = {
      articles: {
        total: articles.length,
        published: articles.filter(a => a.status === 'published').length,
        draft: articles.filter(a => a.status === 'draft').length,
        archived: articles.filter(a => a.status === 'archived').length,
        featured: articles.filter(a => a.featured).length,
      },
      networks: {
        total: networks.length,
      },
      categories: {
        total: categories.length,
      },
      notifications: {
        total: notifications.length,
        sent: notifications.filter(n => n.status === 'sent').length,
        failed: notifications.filter(n => n.status === 'failed').length,
      },
      latestArticles: articles
        .filter(a => a.status === 'published')
        .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime())
        .slice(0, 5),
      latestNotifications: notifications
        .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
        .slice(0, 5),
      articlesByCategory: categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        count: articles.filter(a => a.categories.includes(cat.id) && a.status === 'published').length,
      })),
      articlesByNetwork: networks.map(net => ({
        id: net.id,
        name: net.name,
        count: articles.filter(a => a.network === net.id && a.status === 'published').length,
      })),
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Initialize database
Database.init();

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API docs available at http://localhost:${PORT}/api`);
});

export default app;
