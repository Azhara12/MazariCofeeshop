import express from 'express';
import {
  authUser,
  registerUser,
  getAllUsers,
  toggleUserRole,
  deleteUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── PUBLIC AUTH ROUTES ──────────────────────────────────────────────────────
router.post('/register', registerUser);
router.post('/login', authUser);

// ─── ADMIN USER MANAGEMENT ROUTES ───────────────────────────────────────────
router.get('/', protect, admin, getAllUsers);
router.patch('/:id/role', protect, admin, toggleUserRole);
router.delete('/:id', protect, admin, deleteUser);

export default router;