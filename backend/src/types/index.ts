// Article types
export type ArticleStatus = 'draft' | 'published' | 'archived';

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  categories: string[];
  network: string;
  status: ArticleStatus;
  featured: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  createdAt: Date;
}

// Network types
export interface Network {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

// Notification types
export interface EmailNotification {
  id: string;
  articleId: string;
  recipients: string[];
  subject: string;
  htmlContent: string;
  sentAt: Date;
  status: 'sent' | 'failed';
}

// Query params
export interface ArticleFilters {
  status?: ArticleStatus;
  categories?: string[];
  network?: string;
  featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
