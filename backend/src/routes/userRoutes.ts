import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';
import { upload, uploadErrorHandler } from '../middleware/upload.js';

const router = Router();

// Auth-required routes first
router.post(
  '/upload-avatar',
  authMiddleware,
  upload.single('avatar'),
  uploadErrorHandler,
  (req, res) => userController.uploadAvatar(req, res)
);

router.patch('/profile', authMiddleware, (req, res) => userController.updateProfile(req, res));

// Public routes
router.get('/', (req, res) => userController.getAllUsers(req, res));
router.get('/:username', (req, res) => userController.getProfile(req, res));

export default router;
