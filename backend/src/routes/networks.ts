import express from 'express';
import { NetworkController } from '../controllers/networkController.js';

const router = express.Router();

// GET all networks
router.get('/', NetworkController.getAll);

// GET single network
router.get('/:id', NetworkController.getById);

// GET network stats
router.get('/:id/stats', NetworkController.getStats);

// POST create network
router.post('/', NetworkController.create);

// PUT update network
router.put('/:id', NetworkController.update);

// DELETE network
router.delete('/:id', NetworkController.delete);

export default router;
