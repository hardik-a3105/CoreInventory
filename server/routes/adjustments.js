import express from 'express';
import {
  getAdjustments,
  getAdjustment,
  createAdjustment
} from '../controllers/adjustmentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all adjustments
router.get('/', getAdjustments);

// Get single adjustment
router.get('/:id', getAdjustment);

// Create adjustment
router.post('/', createAdjustment);

export default router;