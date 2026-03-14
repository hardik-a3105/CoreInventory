import express from 'express';
import {
  getWarehouses,
  getWarehouse,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse
} from '../controllers/warehouseController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all warehouses
router.get('/', getWarehouses);

// Get single warehouse
router.get('/:id', getWarehouse);

// Create warehouse (Manager/Admin only)
router.post('/', requireRole(['MANAGER', 'ADMIN']), createWarehouse);

// Update warehouse (Manager/Admin only)
router.put('/:id', requireRole(['MANAGER', 'ADMIN']), updateWarehouse);

// Delete warehouse (Admin only)
router.delete('/:id', requireRole(['ADMIN']), deleteWarehouse);

export default router;