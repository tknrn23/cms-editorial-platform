import express from 'express';
import { CategoryController } from '../controllers/categoryController.js';

const router = express.Router();

// GET all categories
router.get('/', CategoryController.getAll);

// GET single category
router.get('/:id', CategoryController.getById);

// GET category stats
router.get('/:id/stats', CategoryController.getStats);

// POST create category
router.post('/', CategoryController.create);

// PUT update category
router.put('/:id', CategoryController.update);

// DELETE category
router.delete('/:id', CategoryController.delete);

export default router;
