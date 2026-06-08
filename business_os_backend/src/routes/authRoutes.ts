import { Router } from 'express';
import { authController } from '../controllers/authController.js';

const router = Router();

router.post('/register-company', authController.registerCompany);
router.post('/login', authController.login);

export default router;