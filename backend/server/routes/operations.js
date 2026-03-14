import express from 'express';
import {
  getOperations,
  getOperation,
  createOperation,
  updateOperationStatus
} from '../controllers/operationController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all operations
router.get('/', getOperations);

// Get single operation
router.get('/:id', getOperation);

// Create operation
router.post('/', createOperation);

// Update operation status
router.patch('/:id/status', authorizeRole(['MANAGER', 'ADMIN', 'STAFF']), updateOperationStatus);

export default router;