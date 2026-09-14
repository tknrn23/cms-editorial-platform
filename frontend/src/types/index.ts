export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  categories: string[];
  network: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  createdAt: Date;
}

export interface Network {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

export interface EmailNotification {
  id: string;
  articleId: string;
  recipients: string[];
  subject: string;
  htmlContent: string;
  sentAt: Date;
  status: 'sent' | 'failed';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardStats {
  articles: {
    total: number;
    published: number;
    draft: number;
    archived: number;
    featured: number;
  };
  networks: { total: number };
  categories: { total: number };
  notifications: {
    total: number;
    sent: number;
    failed: number;
  };
  latestArticles: Article[];
  latestNotifications: EmailNotification[];
  articlesByCategory: { id: string; name: string; count: number }[];
  articlesByNetwork: { id: string; name: string; count: number }[];
}

export interface ArticleFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'draft' | 'published' | 'archived';
  network?: string;
  featured?: boolean;
}
