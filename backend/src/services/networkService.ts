import { v4 as uuidv4 } from 'uuid';
import { Database } from '../models/index.js';
import type { Network } from '../types/index.js';

export class NetworkService {
  static getAllNetworks(): Network[] {
    return Array.from(Database.networks.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  static getNetworkById(id: string): Network | null {
    return Database.networks.get(id) || null;
  }

  static createNetwork(data: Omit<Network, 'id' | 'createdAt'>): Network {
    const id = uuidv4();
    const network: Network = {
      id,
      ...data,
      createdAt: new Date(),
    };

    Database.networks.set(id, network);
    return network;
  }

  static updateNetwork(id: string, data: Partial<Network>): Network | null {
    const network = Database.networks.get(id);
    if (!network) return null;

    const updated: Network = {
      ...network,
      ...data,
      id: network.id,
      createdAt: network.createdAt,
    };

    Database.networks.set(id, updated);
    return updated;
  }

  static deleteNetwork(id: string): boolean {
    return Database.networks.delete(id);
  }

  static getNetworkStats(networkId: string) {
    const articles = Array.from(Database.articles.values())
      .filter(a => a.network === networkId);

    return {
      totalArticles: articles.length,
      publishedArticles: articles.filter(a => a.status === 'published').length,
      draftArticles: articles.filter(a => a.status === 'draft').length,
      featuredArticles: articles.filter(a => a.featured).length,
    };
  }
}
