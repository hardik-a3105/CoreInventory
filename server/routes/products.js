import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all products (with pagination and filtering)
router.get('/', getProducts);

// Get single product
router.get('/:id', getProduct);

// Create product (Manager/Admin only)
router.post('/', requireRole(['MANAGER', 'ADMIN']), createProduct);

// Update product (Manager/Admin only)
router.put('/:id', requireRole(['MANAGER', 'ADMIN']), updateProduct);

// Delete product (Admin only)
router.delete('/:id', requireRole(['ADMIN']), deleteProduct);

export default router;