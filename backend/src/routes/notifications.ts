import express from 'express';
import { NotificationController } from '../controllers/notificationController.js';

const router = express.Router();

// GET all notifications
router.get('/', NotificationController.getAll);

// GET latest notifications
router.get('/latest', NotificationController.getLatest);

// GET notification stats
router.get('/stats', NotificationController.getStats);

// GET single notification
router.get('/:id', NotificationController.getById);

// POST send notification for article
router.post('/:articleId/send', NotificationController.send);

export default router;
