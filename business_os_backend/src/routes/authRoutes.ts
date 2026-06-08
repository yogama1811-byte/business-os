import { Router } from 'express';
import { authController } from '../controllers/authController.js';

const router = Router();

// Route configuration mapping straight to controller execution
router.post('/register-company', authController.registerCompany);

export default router;