import express from 'express';
import { ArticleController } from '../controllers/articleController.js';

const router = express.Router();

// GET all articles with filters
router.get('/', ArticleController.getAll);

// GET statistics
router.get('/stats', ArticleController.getStatistics);

// GET single article
router.get('/:id', ArticleController.getById);

// POST create article
router.post('/', ArticleController.create);

// PUT update article
router.put('/:id', ArticleController.update);

// PATCH update status
router.patch('/:id/status', ArticleController.updateStatus);

// DELETE article
router.delete('/:id', ArticleController.delete);

export default router;
