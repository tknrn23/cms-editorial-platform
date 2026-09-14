import express from 'express';
import { ImportController } from '../controllers/importController.js';

const router = express.Router();

// POST import articles from JSON
router.post('/articles', ImportController.importArticles);

export default router;
