import type { Request, Response } from 'express';
import { NetworkService } from '../services/networkService.js';
import { validateData, createNetworkSchema, updateNetworkSchema } from '../utils/validation.js';

export class NetworkController {
  static getAll(req: Request, res: Response) {
    try {
      const networks = NetworkService.getAllNetworks();
      res.json(networks);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const network = NetworkService.getNetworkById(id);

      if (!network) {
        return res.status(404).json({ error: 'Réseau non trouvé' });
      }

      res.json(network);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static create(req: Request, res: Response) {
    try {
      const validation = validateData(createNetworkSchema, req.body);
      if (!validation.success) {
        return res.status(400).json({ errors: validation.errors });
      }

      const network = NetworkService.createNetwork(validation.data);
      res.status(201).json(network);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validation = validateData(updateNetworkSchema, req.body);
      if (!validation.success) {
        return res.status(400).json({ errors: validation.errors });
      }

      const network = NetworkService.updateNetwork(id, validation.data);
      if (!network) {
        return res.status(404).json({ error: 'Réseau non trouvé' });
      }

      res.json(network);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = NetworkService.deleteNetwork(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Réseau non trouvé' });
      }

      res.json({ message: 'Réseau supprimé' });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static getStats(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const stats = NetworkService.getNetworkStats(id);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
