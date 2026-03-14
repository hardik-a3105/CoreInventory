import express from 'express';
import {
  getOperations,
  getOperation,
  createOperation,
  updateOperationStatus
} from '../controllers/operationController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all operations
router.get('/', getOperations);

// Get single operation
router.get('/:id', getOperation);

// Create operation
router.post('/', createOperation);

// Update operation status (Manager/Admin only)
router.patch('/:id/status', requireRole(['MANAGER', 'ADMIN']), updateOperationStatus);

export default router;