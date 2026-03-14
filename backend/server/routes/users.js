import express from 'express';
import { getUsers, updateUserRole, deleteUser } from '../controllers/userController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Only ADMIN can manage users
router.use(authenticateToken);
router.use(authorizeRole(['ADMIN']));

router.get('/', getUsers);
router.patch('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

export default router;
