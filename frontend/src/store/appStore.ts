import { create } from 'zustand';
import type { Article, Category, Network, EmailNotification } from '../types/index';

interface AppStore {
  // Articles
  articles: Article[];
  setArticles: (articles: Article[]) => void;
  addArticle: (article: Article) => void;
  updateArticle: (id: string, article: Article) => void;
  removeArticle: (id: string) => void;

  // Categories
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  removeCategory: (id: string) => void;

  // Networks
  networks: Network[];
  setNetworks: (networks: Network[]) => void;

  // Notifications
  notifications: EmailNotification[];
  setNotifications: (notifications: EmailNotification[]) => void;
  addNotification: (notification: EmailNotification) => void;

  // UI State
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  articles: [],
  setArticles: (articles) => set({ articles }),
  addArticle: (article) => set((state) => ({ articles: [article, ...state.articles] })),
  updateArticle: (id, article) =>
    set((state) => ({
      articles: state.articles.map((a) => (a.id === id ? article : a)),
    })),
  removeArticle: (id) =>
    set((state) => ({
      articles: state.articles.filter((a) => a.id !== id),
    })),

  categories: [],
  setCategories: (categories) => set({ categories }),
  addCategory: (category) => set((state) => ({ categories: [...state.categories, category] })),
  removeCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    })),

  networks: [],
  setNetworks: (networks) => set({ networks }),

  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
  addNotification: (notification) => set((state) => ({ notifications: [notification, ...state.notifications] })),

  loading: false,
  setLoading: (loading) => set({ loading }),
  error: null,
  setError: (error) => set({ error }),
}));
