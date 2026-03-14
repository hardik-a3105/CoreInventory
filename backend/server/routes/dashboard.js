import express from 'express';
import {
  getKPIs,
  getRecentOperations,
  getStockHealth,
  getWarehouseCapacity
} from '../controllers/dashboardController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get dashboard KPIs
router.get('/kpis', getKPIs);

// Get recent operations
router.get('/operations', getRecentOperations);

// Get stock health data
router.get('/stock-health', getStockHealth);

// Get warehouse capacity
router.get('/warehouses', getWarehouseCapacity);

export default router;